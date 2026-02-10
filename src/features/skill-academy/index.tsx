"use client";

import type { GetSkillsResponse, GetTrendingTagsResponse, Skill, TrendingTag } from "@/interfaces";
import { getSkills } from "@/services";
import { deleteSkill, getTrendingTags } from "@/services/academy.service";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SearchInput } from "../explore/components/SearchInput";
import { AddToAgentModal } from "./components/AddToAgentModal";
import { CreateAcademyItemModal } from "./components/CreateAcademyItemModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { SkillAcademyHeader } from "./components/SkillAcademyHeader";
import { SkillCard } from "./components/SkillCard";
import { SkillCardSkeleton } from "./components/SkillCardSkeleton";
import { AcademyItem, AcademyItemType } from "./type";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";

// Map Skill/Prompt from API to AcademyItem format
const mapSkillToAcademyItem = (
  skill: Skill,
  type: AcademyItemType
): AcademyItem => {
  return {
    id: skill.id,
    title: skill.name,
    description: skill.description,
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
    type: (skill.type as AcademyItemType) || type,
    tags: skill.tags?.map((tag) => tag.name) || [],
    likes: skill.like_count,
    uses: skill.download_count,
    is_liked: skill.is_liked,
    createdAt: skill.created_at,
  };
};

// Component that reads search params from URL
const SkillAcademyContent = ({
  initialSkillsData,
  initialTrendingTagsData,
}: {
  initialSkillsData: GetSkillsResponse | null;
  initialTrendingTagsData: GetTrendingTagsResponse | null;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial tab and search from URL
  const getInitialTab = (): AcademyItemType => {
    const tabFromUrl = searchParams.get("tab");
    return tabFromUrl === "skill" ? "skill" : "prompt";
  };

  const getInitialSearch = (): string => {
    return searchParams.get("search") || "";
  };

  const getInitialSelectedTags = (): string[] => {
    const tagsParam = searchParams.get("tags");
    return tagsParam ? tagsParam.split(",").filter(Boolean) : [];
  };

  const [activeTab, setActiveTab] = useState<AcademyItemType>(getInitialTab);
  const [searchInput, setSearchInput] = useState<string>(getInitialSearch);
  const [searchQuery, setSearchQuery] = useState<string>(getInitialSearch);
  const [selectedTags, setSelectedTags] = useState<string[]>(getInitialSelectedTags);
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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Ensure URL always has tab param, redirect if missing
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");

    // If no tab param in URL, redirect to default tab
    if (!tabFromUrl) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", "prompt");
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
      return;
    }

    // Sync tab from URL
    isSyncingFromUrl.current = true;
    const newTab: AcademyItemType = tabFromUrl === "skill" ? "skill" : "prompt";
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }

    // Reset flag after a short delay
    setTimeout(() => {
      isSyncingFromUrl.current = false;
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Sync search and tags from URL (only on mount or when URL changes externally)
  useEffect(() => {
    isSyncingFromUrl.current = true;

    const search = searchParams.get("search") || "";
    const tagsParam = searchParams.get("tags");
    const newTags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];

    // Only update state if values are different to avoid loops
    if (search !== searchInput) {
      setSearchInput(search);
      setSearchQuery(search);
    }

    if (JSON.stringify(newTags) !== JSON.stringify(selectedTags)) {
      setSelectedTags(newTags);
    }

    // Reset flag after a short delay
    setTimeout(() => {
      isSyncingFromUrl.current = false;
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Fetch data from API using React Query with infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [activeTab, activeTab, searchQuery || null, selectedTags.length > 0 ? selectedTags.join(',') : null],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getSkills({
        ...(searchQuery.trim() && { search: searchQuery.trim() }),
        ...(selectedTags.length > 0 && { tags: selectedTags.join(',') }),
        page: pageParam,
        limit: 20,
        is_active: true,
        type: activeTab,
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const pageData = lastPage as any;
      if (!pageData) return undefined;
      const total = pageData.total;
      const page = pageData.page;
      const limit = pageData.limit;
      if (typeof total !== 'number' || typeof page !== 'number' || typeof limit !== 'number') {
        return undefined;
      }
      const hasMore = page * limit < total;
      return hasMore ? page + 1 : undefined;
    },
    initialPageParam: 1,
    initialData: initialSkillsData
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
        ? page.data.map((item) => mapSkillToAcademyItem(item, activeTab))
        : []
    );
  }, [data, activeTab]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isLoading
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  // Fetch trending tags from API
  const { data: trendingTagsData, isLoading: isLoadingTags } = useQuery({
    queryKey: ["trending-tags"],
    queryFn: async () => {
      return await getTrendingTags({ limit: 20 });
    },
    placeholderData: initialTrendingTagsData as any,
  });

  // Extract trending tags (limit to 20)
  const trendingTags = useMemo((): TrendingTag[] => {
    const responseData = trendingTagsData as any;
    if (!responseData?.data?.tags) return [];
    return responseData.data.tags.slice(0, 20);
  }, [trendingTagsData]);

  // Display tags based on showAllTags state (10 initially, 20 when expanded)
  const displayedTags = useMemo(() => {
    return showAllTags ? trendingTags : trendingTags.slice(0, 10);
  }, [trendingTags, showAllTags]);

  // Extract tag names for filtering
  const allTags = useMemo(() => {
    return trendingTags.map((tag) => tag.name);
  }, [trendingTags]);

  // Items are already filtered by API based on selectedTags
  const currentItems = items;

  // Update URL when tab changes
  const handleTabChange = (id: AcademyItemType) => {
    setActiveTab(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
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
    // Don't update URL if we're currently syncing from URL
    if (isSyncingFromUrl.current) {
      return;
    }

    // Update URL when searchQuery changes (debounced)
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","));
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [searchQuery, activeTab, router, selectedTags]);

  // Handle tag filter toggle
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];

      // Update URL
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", activeTab);
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
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", activeTab);
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
    ? (error as any)?.error || `Failed to load ${activeTab}s`
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
      itemIdToDelete
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
        typeof itemIdToDelete
      );
      // Pass the ID directly (can be string or number)
      await deleteSkill(itemIdToDelete);
      toast.dismiss(loadingToast);
      toast.success("Skill deleted successfully!");
      setDeleteItemId(null);
      // Refetch data
      queryClient.invalidateQueries({
        queryKey: [activeTab, activeTab, searchQuery || null, selectedTags.length > 0 ? selectedTags.join(',') : null],
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
      queryKey: [activeTab, activeTab, searchQuery || null, selectedTags.length > 0 ? selectedTags.join(',') : null],
    });
    setEditItem(null);
  };

  const handleDownloadSuccess = (itemId: string) => {
    // Optimistically update download count in query cache
    queryClient.setQueryData(
      [activeTab, activeTab, searchQuery || null, selectedTags.length > 0 ? selectedTags.join(',') : null],
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
                  : skill
              ),
            },
          })),
        };
      }
    );
  };

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto pb-4 relative">
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

          {/* Switch */}
          <div className="md:w-auto md:min-w-[200px] shrink-0 bg-[#1b1b1b] rounded-[8px]">
            <div className="rounded-[8px] flex gap-[2px] ">
              <button
                onClick={() => handleTabChange("prompt")}
                className={cn(
                  "flex-1 px-4 py-2 text-sm font-medium rounded-[8px] transition-colors",
                  activeTab === "prompt"
                    ? "bg-[rgba(254,86,49,0.2)] text-[#fe5631]"
                    : "bg-[#1b1b1b] text-[#717171]"
                )}
              >
                Prompts
              </button>
              <button
                onClick={() => handleTabChange("skill")}
                className={cn(
                  "flex-1 px-4 py-2 text-sm font-medium rounded-[8px] transition-colors",
                  activeTab === "skill"
                    ? "bg-[rgba(254,86,49,0.2)] text-[#fe5631]"
                    : "bg-[#1b1b1b] text-[#717171]"
                )}
              >
                Skills
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
              <span className="text-body-sm text-neutral-secondary">Filter by tags</span>
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
            <div className="flex flex-wrap gap-2 items-center overflow-x-auto pb-1 scrollbar-hide items-center">
              {isLoadingTags ? (
                // Skeleton loading for tags
                Array.from({ length: 10 }).map((_, index) => {
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
                          isSelected
                            ? ""
                            : ""
                        )}
                      >
                        <Badge
                          variant={isSelected ? "primary" : "secondary"}
                          type={isSelected ? "tonal" : "tonal"}
                          className={cn(
                            "cursor-pointer text-xs font-normal transition-all duration-200",
                            isSelected
                              ? "bg-[rgba(254,86,49,0.2)] text-[#fe5631] border-none hover:bg-[rgba(254,86,49,0.3)]"
                              : "text-neutral-tertiary bg-neutral-02 hover:bg-neutral-03 border-none"
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
                  {trendingTags.length > 10 && (
                    <button
                      onClick={() => setShowAllTags(!showAllTags)}
                      className="text-body-xs text-[#fe5631] hover:text-[#ff6d47] transition-colors whitespace-nowrap shrink-0"
                    >
                      {showAllTags ? "Show less" : `Show more (${trendingTags.length - 10})`}
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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkillCardSkeleton key={`loading-${index}`} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-body-md text-neutral-tertiary">
              No {activeTab}s found. Be the first to create one!
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
        defaultType={activeTab}
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
    </div>
  );
};

// Main export component - wrapper that handles search params
export const SkillAcademy = ({
  initialSkillsData,
  initialTrendingTagsData,
}: {
  initialSkillsData?: GetSkillsResponse | null;
  initialTrendingTagsData?: GetTrendingTagsResponse | null;
}) => {
  return (
    <SkillAcademyContent
      initialSkillsData={initialSkillsData || null}
      initialTrendingTagsData={initialTrendingTagsData || null}
    />
  );
};
