"use client";

import type { Skill } from "@/interfaces";
import { getSkills } from "@/services";
import { deleteSkill } from "@/services/academy.service";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchInput } from "../explore/components/SearchInput";
import { AddToAgentModal } from "./components/AddToAgentModal";
import { CreateAcademyItemModal } from "./components/CreateAcademyItemModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { SkillAcademyHeader } from "./components/SkillAcademyHeader";
import { SkillCard } from "./components/SkillCard";
import { SkillCardSkeleton } from "./components/SkillCardSkeleton";
import { AcademyItem, AcademyItemType } from "./type";

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
const SkillAcademyContent = () => {
  const router = useRouter();

  // Read initial tab and search from URL
  const getInitialTab = (): AcademyItemType => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      return tab === "skill" ? "skill" : "prompt";
    }
    return "skill";
  };

  const getInitialSearch = (): string => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("search") || "";
    }
    return "";
  };

  const [activeTab, setActiveTab] = useState<AcademyItemType>(getInitialTab);
  const [searchInput, setSearchInput] = useState<string>(getInitialSearch);
  const [searchQuery, setSearchQuery] = useState<string>(getInitialSearch);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // State for Add To Agent modal
  const [itemAddingToAgent, setItemAddingToAgent] =
    useState<AcademyItem | null>(null);

  // State for Edit modal
  const [editItem, setEditItem] = useState<AcademyItem | null>(null);

  // State for Delete confirmation modal
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync tab and search with URL changes (listen to popstate for browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        const newTab = tab === "skill" ? "skill" : "prompt";
        setActiveTab(newTab);
        const search = params.get("search") || "";
        setSearchInput(search);
        setSearchQuery(search);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Fetch data from API using React Query
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: [activeTab, activeTab, searchQuery || null],
    queryFn: async () => {
      return await getSkills({
        ...(searchQuery.trim() && { search: searchQuery.trim() }),
        page: 1,
        limit: 20,
        is_active: true,
        type: activeTab,
      });
    },
  });

  // Map response data to AcademyItem format
  const [items, setItems] = useState<AcademyItem[]>([]);

  useEffect(() => {
    if (response?.data?.data && Array.isArray(response.data.data)) {
      setItems(
        response.data.data.map((item) => mapSkillToAcademyItem(item, activeTab))
      );
    } else {
      setItems([]);
    }
  }, [response, activeTab]);

  const currentItems = items;

  // Update URL when tab changes
  const handleTabChange = (id: AcademyItemType) => {
    setActiveTab(id);
    const params = new URLSearchParams();
    params.set("tab", id);
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    router.push(`/skill-academy?${params.toString()}`, { scroll: false });
  };

  // Handle search input change
  const handleSearchInputChange = (query: string) => {
    setSearchInput(query);
  };

  // Handle search (debounced) - update URL when searchQuery changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    router.push(`/skill-academy?${params.toString()}`, { scroll: false });
  }, [searchQuery, activeTab, router]);

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
        queryKey: [activeTab, activeTab, searchQuery || null],
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
      queryKey: [activeTab, activeTab, searchQuery || null],
    });
    setEditItem(null);
  };

  const handleDownloadSuccess = (itemId: string) => {
    // Optimistically update download count
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, uses: item.uses + 1 } : item
      )
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
export const SkillAcademy = () => {
  return <SkillAcademyContent />;
};
