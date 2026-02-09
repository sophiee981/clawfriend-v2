"use client";

import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
import { AddToAgentModal } from "./components/AddToAgentModal";
import { CreateAcademyItemModal } from "./components/CreateAcademyItemModal";
import { SkillAcademyHeader } from "./components/SkillAcademyHeader";
import { SkillCard } from "./components/SkillCard";
import {
  AcademyItem,
  AcademyItemType,
  MOCK_PROMPTS,
  MOCK_SKILLS,
} from "./data";

export const SkillAcademy = () => {
  const [activeTab, setActiveTab] = useState<AcademyItemType>("skill");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State for Add To Agent modal
  const [itemAddingToAgent, setItemAddingToAgent] =
    useState<AcademyItem | null>(null);

  const currentItems = activeTab === "skill" ? MOCK_SKILLS : MOCK_PROMPTS;

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto pb-4 relative">
      <SkillAcademyHeader onCreateClick={() => setIsCreateModalOpen(true)} />

      <Tabs
        tabs={[
          { id: "skill", label: "Skills" },
          { id: "prompt", label: "Prompts" },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as AcademyItemType)}
        maxWidth=""
        className="px-4 w-full"
      />

      <div className="flex flex-1 flex-col gap-6 pt-6 w-full px-4">
        {currentItems.length > 0 ? (
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
