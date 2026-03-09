"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  GetSkillsResponse,
  GetTrendingTagsResponse,
  Skill,
  TrendingTag,
} from "@/interfaces";
import { getSkills } from "@/services";
import { deleteSkill, getTrendingTags } from "@/services/academy.service";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter } from "@bprogress/next/app";
import { useEffect, useMemo, useRef, useState } from "react";
import { useViewWidth } from "@/hooks/useViewSize";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { ScrollButton } from "@/components/common/ScrollButton";
import { SearchInput } from "../explore/components/SearchInput";
import { AddToAgentModal } from "./components/AddToAgentModal";
import { CreateAcademyItemModal } from "./components/CreateAcademyItemModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { SkillAcademyHeader } from "./components/SkillAcademyHeader";
import { SkillCard } from "./components/SkillCard";
import { SkillCardSkeleton } from "./components/SkillCardSkeleton";
import { AcademyItem, AcademyItemType } from "./type";

type SortFilter = "hottest" | "newest" | "trending";

// Map Skill/Prompt from API to AcademyItem format
const mapSkillToAcademyItem = (skill: Skill): AcademyItem => {
  // Get tags from first version if available, otherwise fallback to skill tags
  const tagsToUse =
    skill.versions &&
    skill.versions.length > 0 &&
    skill.versions[0].tags &&
    skill.versions[0].tags.length > 0
      ? skill.versions[0].tags.map((tag) => tag.name)
      : skill.tags?.map((tag) => tag.name) || [];

  return {
    id: skill.id,
    title: skill.name,
    content: skill.content,
    author: {
      name:
        skill.creator?.display_name ||
        skill.creator?.owner_x_name ||
        "Anonymous",
      avatar:
        skill.creator?.avatar ||
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous",
      handle:
        skill.creator?.owner_x_handle ||
        skill.creator?.x_username ||
        "@anonymous",
      username: skill.creator?.username,
    },
    type: (skill.type as AcademyItemType) || "skill",
    tags: tagsToUse,
    likes: skill.like_count,
    uses: skill.download_count,
    is_liked: skill.is_liked,
    createdAt: skill.created_at,
    version_number: skill?.versions[0]?.versionNumber || undefined,
    visibility: skill.visibility,
  };
};

// Helper function to get URL search params
const getSearchParams = (): URLSearchParams => {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
};

// Component that reads search params from URL
const SkillAcademyContent = ({
  initialSkillsData,
  initialTrendingTagsData,
}: {
  initialSkillsData: GetSkillsResponse;
  initialTrendingTagsData: GetTrendingTagsResponse;
}) => {
  const router = useRouter();

  // Initialize with default values first, will be synced from URL in useEffect
  const [sortFilter, setSortFilter] = useState<SortFilter>("trending");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // State for Add To Agent modal
  const [itemAddingToAgent, setItemAddingToAgent] =
    useState<AcademyItem | null>(null);

  // State for Edit modal
  const [editItem, setEditItem] = useState<AcademyItem | null>(null);

  // State for Delete confirmation modal
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  // Ref to track if we're syncing from URL to avoid infinite loops
  const isSyncingFromUrl = useRef(false);
  const isInitialized = useRef(false);

  // Use scroll to top hook
  const { showScrollTop, scrollToTop } = useScrollToTop({
    containerSelector: ".skill-market-scroll-container",
    threshold: 300,
    behavior: "smooth",
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Initialize state from URL on mount (only once)
  useEffect(() => {
    if (isInitialized.current) return;

    const params = getSearchParams();
    const sortFromUrl = params.get("sort");
    const search = params.get("search") || "";
    const tagsParam = params.get("tags");
    const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];

    isSyncingFromUrl.current = true;

    if (!sortFromUrl) {
      const newParams = new URLSearchParams(params.toString());
      newParams.set("sort", "trending");
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;
      router.replace(newUrl, { scroll: false });
      setSortFilter("trending");
    } else {
      setSortFilter(
        sortFromUrl === "newest"
          ? "newest"
          : sortFromUrl === "hottest"
            ? "hottest"
            : "trending",
      );
    }

    setSearchInput(search);
    setSearchQuery(search);
    setSelectedTags(tags);

    isInitialized.current = true;
    setTimeout(() => {
      isSyncingFromUrl.current = false;
    }, 100);
  }, [router]);

  // Sync URL params with state (handle browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const params = getSearchParams();
      const sortFromUrl = params.get("sort");
      const search = params.get("search") || "";
      const tagsParam = params.get("tags");
      const newTags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];

      isSyncingFromUrl.current = true;

      setSortFilter(
        sortFromUrl === "newest"
          ? "newest"
          : sortFromUrl === "trending"
            ? "trending"
            : "hottest",
      );
      setSearchInput(search);
      setSearchQuery(search);
      setSelectedTags(newTags);

      setTimeout(() => {
        isSyncingFromUrl.current = false;
      }, 100);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  // Fetch data from API using React Query with infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "skills",
      sortFilter,
      searchQuery || null,
      selectedTags.length > 0 ? selectedTags.join(",") : null,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getSkills({
        ...(searchQuery.trim() && { search: searchQuery.trim() }),
        ...(selectedTags.length > 0 && { tags: selectedTags.join(",") }),
        page: pageParam,
        limit: 18,
        is_active: true,
        sort_by:
          sortFilter === "newest"
            ? "created_at"
            : sortFilter === "trending"
              ? "trending"
              : "hottest",
        sort_order: "desc",
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const pageData = lastPage as any;
      if (!pageData) return undefined;
      const total = pageData.total;
      const page = pageData.page;
      const limit = pageData.limit;
      if (
        typeof total !== "number" ||
        typeof page !== "number" ||
        typeof limit !== "number"
      ) {
        return undefined;
      }
      const hasMore = page * limit < total;
      return hasMore ? page + 1 : undefined;
    },
    initialPageParam: 1,
    initialData: initialSkillsData?.data
      ? {
          pages: [initialSkillsData],
          pageParams: [1],
        }
      : undefined,
  });

  // Map response data to AcademyItem format and flatten pages
  const items = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) =>
      page?.data && Array.isArray(page.data)
        ? page.data.map((item) => mapSkillToAcademyItem(item))
        : [],
    );
  }, [data]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isLoading &&
          !isFetching
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, isLoading, isFetching, fetchNextPage]);

  // Fetch trending tags from API
  const { data: trendingTagsData, isLoading: isLoadingTags } = useQuery({
    queryKey: ["trending-tags"],
    queryFn: async () => {
      const response = await getTrendingTags({ limit: 20 });
      return response.data;
    },
    placeholderData: initialTrendingTagsData,
  });

  // Extract trending tags (limit to 20)
  const trendingTags = useMemo((): TrendingTag[] => {
    if (!trendingTagsData?.tags) return [];
    return trendingTagsData.tags;
  }, [trendingTagsData]);

  // Get view width for responsive tag display
  const viewWidth = useViewWidth();

  // Calculate tag limit based on breakpoint
  const tagLimit = useMemo(() => {
    if (viewWidth < 640) {
      // Smaller than sm: 5 tags
      return 5;
    } else if (viewWidth >= 1024) {
      // Larger than lg: 12 tags
      return 12;
    } else {
      // Between sm and lg: 10 tags (default)
      return 10;
    }
  }, [viewWidth]);

  const displayedTags = useMemo(() => {
    return showAllTags ? trendingTags : trendingTags.slice(0, tagLimit);
  }, [trendingTags, showAllTags, tagLimit]);

  // Extract tag names for filtering
  const allTags = useMemo(() => {
    return trendingTags.map((tag) => tag.name);
  }, [trendingTags]);

  // Items are already filtered by API based on selectedTags
  const currentItems = items;

  // Update URL when sort filter changes
  const handleSortChange = (sort: SortFilter) => {
    if (sort === sortFilter) return;

    setSortFilter(sort);
    const params = new URLSearchParams();
    params.set("sort", sort);
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","));
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  // Handle search input change
  const handleSearchInputChange = (query: string) => {
    setSearchInput(query);
  };

  // Handle search (debounced) - update URL when searchQuery changes
  useEffect(() => {
    if (isSyncingFromUrl.current || !isInitialized.current) {
      return;
    }

    const params = new URLSearchParams();
    params.set("sort", sortFilter);
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","));
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [searchQuery, sortFilter, router, selectedTags]);

  // Handle tag filter toggle
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];

      const params = getSearchParams();
      params.set("sort", sortFilter);
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      } else {
        params.delete("search");
      }
      if (newTags.length > 0) {
        params.set("tags", newTags.join(","));
      } else {
        params.delete("tags");
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.push(newUrl, { scroll: false });

      return newTags;
    });
  };

  // Handle clear all tags
  const handleClearTags = () => {
    setSelectedTags([]);
    const params = getSearchParams();
    params.set("sort", sortFilter);
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    params.delete("tags");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const errorMessage = error
    ? (error as any)?.error || "Failed to load skills"
    : null;

  const handleEdit = (item: AcademyItem) => {
    setEditItem(item);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (itemId: string) => {
    console.log("handleDelete called with itemId:", itemId);
    setDeleteItemId(itemId);
  };

  const confirmDelete = async () => {
    // Capture the ID immediately to prevent it from being lost
    const itemIdToDelete = deleteItemId;
    console.log(
      "confirmDelete called with deleteItemId:",
      deleteItemId,
      "itemIdToDelete:",
      itemIdToDelete,
    );

    if (!itemIdToDelete) {
      console.error("No item ID to delete");
      setDeleteItemId(null);
      return;
    }

    const loadingToast = toast.loading("Deleting skill...");
    try {
      console.log(
        "Deleting skill with ID:",
        itemIdToDelete,
        "type:",
        typeof itemIdToDelete,
      );
      // Pass the ID directly (can be string or number)
      await deleteSkill(itemIdToDelete);
      toast.dismiss(loadingToast);
      toast.success("Skill deleted successfully!");
      setDeleteItemId(null);
      // Refetch data
      queryClient.invalidateQueries({
        queryKey: [
          "skills",
          sortFilter,
          searchQuery || null,
          selectedTags.length > 0 ? selectedTags.join(",") : null,
        ],
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error("Delete error:", error);
      const errorMessage =
        error?.error || error?.message || "Failed to delete skill";
      toast.error(errorMessage);
      // Don't close modal on error so user can try again
    }
  };

  const handleModalSuccess = () => {
    // Refetch data after create/update
    queryClient.invalidateQueries({
      queryKey: [
        "skills",
        sortFilter,
        searchQuery || null,
        selectedTags.length > 0 ? selectedTags.join(",") : null,
      ],
    });
    setEditItem(null);
  };

  const handleDownloadSuccess = (itemId: string) => {
    // Optimistically update download count in query cache
    queryClient.setQueryData(
      [
        "skills",
        sortFilter,
        searchQuery || null,
        selectedTags.length > 0 ? selectedTags.join(",") : null,
      ],
      (oldData: any) => {
        if (!oldData?.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.data.map((skill: any) =>
                skill.id === itemId
                  ? { ...skill, download_count: skill.download_count + 1 }
                  : skill,
              ),
            },
          })),
        };
      },
    );
  };

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto pb-4 relative scrollbar-hide skill-market-scroll-container">
      <SkillAcademyHeader onCreateClick={() => setIsCreateModalOpen(true)} />
      {/* Search and Tabs Section - Responsive */}
      <div className="w-full px-4 md:px-6 py-3 md:py-4 border-b border-neutral-01">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 w-full">
          {/* Search Input */}
          <div className="flex-1 min-w-0">
            <SearchInput
              value={searchInput}
              onChange={handleSearchInputChange}
              onSearch={handleSearchInputChange}
              placeholder="Search by skill or prompt"
              className="!border-none !px-0 !py-0"
              hideBackButton
              inputClassName="h-9 placeholder:text-[14px]"
            />
          </div>

          {/* Divider - Hidden on mobile */}
          <div className="hidden md:block w-[2px] h-5 bg-neutral-03 shrink-0"></div>

          {/* Sort Filter */}
          <div className="md:w-auto shrink-0 bg-[#1b1b1b] rounded-[8px]">
            <div className="rounded-[8px] flex gap-[2px]">
              <button
                onClick={() => handleSortChange("trending")}
                className={cn(
                  "flex-1 px-4 py-2 text-sm font-medium rounded-[8px] transition-colors",
                  sortFilter === "trending"
                    ? "bg-[rgba(254,86,49,0.2)] text-[#fe5631]"
                    : "bg-[#1b1b1b] text-[#717171]",
                )}
              >
                Trending
              </button>
              <button
                onClick={() => handleSortChange("newest")}
                className={cn(
                  "flex-1 px-4 py-2 text-sm font-medium rounded-[8px] transition-colors",
                  sortFilter === "newest"
                    ? "bg-[rgba(254,86,49,0.2)] text-[#fe5631]"
                    : "bg-[#1b1b1b] text-[#717171]",
                )}
              >
                New
              </button>
              <button
                onClick={() => handleSortChange("hottest")}
                className={cn(
                  "flex-1 px-4 py-2 text-sm font-medium rounded-[8px] transition-colors",
                  sortFilter === "hottest"
                    ? "bg-[rgba(254,86,49,0.2)] text-[#fe5631]"
                    : "bg-[#1b1b1b] text-[#717171]",
                )}
              >
                Rate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tag Filter Section */}
      {(isLoadingTags || allTags.length > 0) && (
        <div className="w-full px-4 md:px-6 py-3 border-b border-neutral-01">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-neutral-secondary">
                Filter by tags
              </span>
              {selectedTags.length > 0 && !isLoadingTags && (
                <button
                  onClick={handleClearTags}
                  className="text-body-xs text-[#fe5631] hover:text-[#ff6d47] transition-colors flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear filters
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 items-center overflow-x-auto pb-1 scrollbar-hide">
              {isLoadingTags ? (
                // Skeleton loading for tags
                Array.from({ length: tagLimit }).map((_, index) => {
                  const widths = [60, 70, 80, 65, 75, 85, 70, 80, 65, 75];
                  return (
                    <Skeleton
                      key={`tag-skeleton-${index}`}
                      customWidth={`${widths[index % widths.length]}px`}
                      customHeight="24px"
                      className="rounded-full"
                    />
                  );
                })
              ) : (
                <>
                  {displayedTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.name);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.name)}
                        className={cn(
                          "transition-all duration-200",
                          isSelected ? "" : "",
                        )}
                      >
                        <Badge
                          variant={isSelected ? "primary" : "secondary"}
                          type={isSelected ? "tonal" : "tonal"}
                          className={cn(
                            "cursor-pointer text-xs font-normal transition-all duration-200",
                            isSelected
                              ? "bg-[rgba(254,86,49,0.2)] text-[#fe5631] border-none hover:bg-[rgba(254,86,49,0.3)]"
                              : "text-neutral-tertiary bg-neutral-02 hover:bg-neutral-03 border-none",
                          )}
                        >
                          #{tag.name}
                          {tag.usage_count > 0 && (
                            <span className="ml-1.5 text-[10px] opacity-70">
                              ({tag.usage_count})
                            </span>
                          )}
                        </Badge>
                      </button>
                    );
                  })}
                  {trendingTags.length > tagLimit && (
                    <button
                      onClick={() => setShowAllTags(!showAllTags)}
                      className="text-body-xs text-[#fe5631] hover:text-[#ff6d47] transition-colors whitespace-nowrap shrink-0 h-6 pt-1"
                    >
                      {showAllTags
                        ? "Show less"
                        : `Show more (${trendingTags.length - tagLimit})`}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Grid - Responsive padding */}
      <div className="flex flex-1 flex-col gap-4 md:gap-6 pt-4 md:pt-6 w-full px-4 md:px-6">
        {isLoading || (isFetching && !isFetchingNextPage) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkillCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : errorMessage ? (
          <div className="text-center py-12">
            <p className="text-body-md text-red-500">{errorMessage}</p>
          </div>
        ) : currentItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentItems.map((item) => (
                <SkillCard
                  key={item.id}
                  item={item}
                  onAddToAgent={() => setItemAddingToAgent(item)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="h-4" />
            {/* Loading indicator for next page */}
            {isFetchingNextPage && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 -mt-10">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkillCardSkeleton key={`loading-${index}`} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-body-md text-neutral-tertiary">
              No skills found. Be the first to create one!
            </p>
          </div>
        )}
      </div>

      <CreateAcademyItemModal
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) {
            setEditItem(null);
          }
        }}
        defaultType="skill"
        editItem={editItem}
        onSuccess={handleModalSuccess}
      />

      <AddToAgentModal
        open={!!itemAddingToAgent}
        onOpenChange={(open) => !open && setItemAddingToAgent(null)}
        item={itemAddingToAgent}
        onDownloadSuccess={handleDownloadSuccess}
      />

      <DeleteConfirmModal
        open={!!deleteItemId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteItemId(null);
          }
        }}
        onConfirm={confirmDelete}
        itemName={
          deleteItemId
            ? currentItems.find((item) => item.id === deleteItemId)?.title
            : undefined
        }
      />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <div className="sm:flex hidden fixed  bottom-20 md:bottom-5 left-0 right-0 z-50 pointer-events-none pl-0 md:pl-[calc(256px)]">
          <div className="w-full flex justify-center">
            <ScrollButton scrollToTop={scrollToTop} />
          </div>
        </div>
      )}
    </div>
  );
};

// Main export component - wrapper that handles search params
export const SkillAcademy = ({
  initialSkillsData,
  initialTrendingTagsData,
}: {
  initialSkillsData: GetSkillsResponse;
  initialTrendingTagsData: GetTrendingTagsResponse;
}) => {
  return (
    <SkillAcademyContent
      initialSkillsData={initialSkillsData || null}
      initialTrendingTagsData={initialTrendingTagsData}
    />
  );
};
