"use client";

import { Tabs } from "@/components/ui/tabs";
import type { Skill } from "@/interfaces";
import { getSkills } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AddToAgentModal } from "./components/AddToAgentModal";
import { CreateAcademyItemModal } from "./components/CreateAcademyItemModal";
import { SkillAcademyHeader } from "./components/SkillAcademyHeader";
import { SkillCard } from "./components/SkillCard";
import { SkillCardSkeleton } from "./components/SkillCardSkeleton";
import { AcademyItem, AcademyItemType } from "./data";

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
      name: "Anonymous",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous",
      handle: "@anonymous",
    },
    type,
    tags: [], // API doesn't provide tags, can be extended later
    likes: skill.like_count,
    uses: skill.download_count,
    createdAt: skill.created_at,
  };
};

// Component that reads search params from URL
const SkillAcademyContent = () => {
  const router = useRouter();

  // Read initial tab from URL
  const getInitialTab = (): AcademyItemType => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      return tab === "skills" || tab === "skill" ? "skill" : "prompt";
    }
    return "skill";
  };

  const [activeTab, setActiveTab] = useState<AcademyItemType>(getInitialTab);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State for Add To Agent modal
  const [itemAddingToAgent, setItemAddingToAgent] =
    useState<AcademyItem | null>(null);

  // Sync tab with URL changes (listen to popstate for browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        const newTab = tab === "skills" || tab === "skill" ? "skill" : "prompt";
        setActiveTab(newTab);
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
    queryKey: [activeTab === "skill" ? "skills" : "prompts", activeTab],
    queryFn: async () => {
      return await getSkills({
        page: 1,
        limit: 20,
        is_active: true,
        // type: activeTab === "skill" ? "skills" : "prompts",
      });
    },
  });

  // Map response data to AcademyItem format
  const currentItems = useMemo(() => {
    if (response?.data?.data && Array.isArray(response.data.data)) {
      return response.data.data.map((item) =>
        mapSkillToAcademyItem(item, activeTab)
      );
    }
    return [];
  }, [response, activeTab]);

  // Update URL when tab changes
  const handleTabChange = (id: AcademyItemType) => {
    setActiveTab(id);
    router.push(`/skill-academy?tab=${id === "skill" ? "skills" : "prompts"}`, {
      scroll: false,
    });
  };

  const errorMessage = error
    ? (error as any)?.error || `Failed to load ${activeTab}s`
    : null;

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto pb-4 relative">
      <SkillAcademyHeader onCreateClick={() => setIsCreateModalOpen(true)} />

      <Tabs
        tabs={[
          { id: "skill", label: "Skills" },
          { id: "prompt", label: "Prompts" },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        maxWidth=""
        className="px-4 w-full"
      />

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
        skill={itemAddingToAgent as unknown as Skill}
      />
    </div>
  );
};

// Main export component - wrapper that handles search params
export const SkillAcademy = () => {
  return <SkillAcademyContent />;
};
