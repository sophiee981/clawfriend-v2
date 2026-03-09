"use client";

import type { TabItem } from "@/components/ui/tabs";
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
import { WalletActivitiesTab } from "./WalletActivitiesTab";
import { WalletHoldingsTab } from "./WalletHoldingsTab";

type TabType = "activities" | "holdings";

interface WalletTabsProps {
  address: string;
}

export const WalletTabs = ({ address }: WalletTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("activities");

  const tabs: TabItem<TabType>[] = [
    { id: "activities", label: "Activities" },
    { id: "holdings", label: "Holdings" },
  ];

  return (
    <div className="flex flex-col flex-1 relative">
      <div className="sticky top-0 z-10 bg-neutral-950 border-t border-neutral-02">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId)}
          maxWidth="max-w-full"
        />
      </div>
      <div className="flex flex-col">
        {activeTab === "activities" && (
          <WalletActivitiesTab address={address} />
        )}
        {activeTab === "holdings" && <WalletHoldingsTab address={address} />}
      </div>
    </div>
  );
};
