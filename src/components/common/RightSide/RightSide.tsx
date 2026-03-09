"use client";

import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/utils";
import { useState } from "react";
import { ActivitiesTab } from "./ActivitiesTab";
import { JustTGEDTab } from "./JustTGEDTab";

interface RightSideProps {
  className?: string;
}

const RightSide = ({ className }: RightSideProps) => {
  const [activeTab, setActiveTab] = useState<"just-tged" | "activities">(
    "just-tged"
  );

  const tabs = [
    { id: "just-tged" as const, label: "Just TGED" },
    { id: "activities" as const, label: "Activities" },
  ];

  return (
    <div
      className={cn(
        "flex h-full flex-col border border-neutral-02 w-[360px] pt-2 overflow-y-auto",
        className
      )}
    >
      {/* Tabs */}
      <Tabs<"just-tged" | "activities">
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="px-4 text-[8px]"
        maxWidth="w-full"
      />

      {/* Tab Content */}
      {activeTab === "just-tged" ? <JustTGEDTab /> : <ActivitiesTab />}
    </div>
  );
};

export default RightSide;
