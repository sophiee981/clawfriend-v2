"use client";

import { Tabs } from "@/components/ui/tabs";
import { getSkills } from "@/services";
import type { Skill } from "@/interfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AddToAgentModal } from "./components/AddToAgentModal";
import { CreateAcademyItemModal } from "./components/CreateAcademyItemModal";
import { SkillAcademyHeader } from "./components/SkillAcademyHeader";
import { SkillCard } from "./components/SkillCard";
import { SkillCardSkeleton } from "./components/SkillCardSkeleton";
import {
  AcademyItem,
  AcademyItemType,
} from "./data";
import { SearchInput } from "../explore/components/SearchInput";

// Map Skill/Prompt from API to AcademyItem format
const mapSkillToAcademyItem = (skill: Skill, type: AcademyItemType): AcademyItem => {
  return {
    id: skill.id,
    title: skill.name,
    description: skill.description,
    content: skill.content,
    author: {
      name: skill.creator.display_name || skill.creator.owner_x_name || "Anonymous",
      avatar: skill.creator.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous",
      handle: skill.creator.owner_x_handle || skill.creator.x_username || "@anonymous",
    },
    type: (skill.type as AcademyItemType) || type,
    tags: skill.tags.map(tag => tag.name),
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
  const [searchQuery, setSearchQuery] = useState<string>(getInitialSearch);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State for Add To Agent modal
  const [itemAddingToAgent, setItemAddingToAgent] =
    useState<AcademyItem | null>(null);

  // Sync tab and search with URL changes (listen to popstate for browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        const newTab = tab === "skill" ? "skill" : "prompt";
        setActiveTab(newTab);
        const search = params.get("search") || "";
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
    queryKey: [
      activeTab,
      activeTab,
      searchQuery || null,
    ],
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
  const currentItems = useMemo(() => {
    if (response?.data?.data && Array.isArray(response.data.data)) {
      return response.data.data.map((item) => mapSkillToAcademyItem(item, activeTab));
    }
    return [];
  }, [response, activeTab]);

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

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    if (query.trim()) {
      params.set("search", query.trim());
    }
    router.push(`/skill-academy?${params.toString()}`, { scroll: false });
  };

  const errorMessage = error ? (error as any)?.error || `Failed to load ${activeTab}s` : null;

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto pb-4 relative">
      <SkillAcademyHeader onCreateClick={() => setIsCreateModalOpen(true)} />
      <div className="flex items-center gap-4 sm:gap-6 w-full py-2">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search by skill or prompt"
          className="flex-1 !border-none"
        />
        <div className="w-[2px] h-full bg-neutral-03"></div>
        <Tabs
          tabs={[
            { id: "skill", label: "Skills" },
            { id: "prompt", label: "Prompts" },
          ]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          maxWidth=""
          className="px-4 w-[200px]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-6 pt-6 w-full px-4">
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
        onOpenChange={setIsCreateModalOpen}
        defaultType={activeTab}
      />

      <AddToAgentModal
        open={!!itemAddingToAgent}
        onOpenChange={(open) => !open && setItemAddingToAgent(null)}
        item={itemAddingToAgent}
      />
    </div>
  );
};

// Main export component - wrapper that handles search params
export const SkillAcademy = () => {
  return <SkillAcademyContent />;
};
