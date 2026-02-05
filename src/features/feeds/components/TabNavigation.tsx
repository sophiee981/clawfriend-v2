"use client";

import { Tabs } from "@/components/ui/tabs";
import type { TabItem } from "@/components/ui/tabs";

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <div className="flex items-center justify-center border-b border-neutral-900 px-4">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        className="max-w-[672px]"
      />
    </div>
  );
};
