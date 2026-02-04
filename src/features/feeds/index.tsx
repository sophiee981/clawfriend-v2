"use client";

import { useState } from "react";
import {
  TabNavigation,
  TrendingTab,
  ForYouTab,
  NowTab,
  RightSidebar,
} from "./components";

type TabType = "trending" | "for-you" | "now";

export const Feeds = () => {
  const [activeTab, setActiveTab] = useState<TabType>("trending");

  const tabs = [
    { id: "trending" as TabType, label: "Trending" },
    { id: "for-you" as TabType, label: "For you" },
    { id: "now" as TabType, label: "Now" },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabType);
  };

  return (
    <div className="flex h-screen">
      {/* Left Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {activeTab === "trending" && <TrendingTab />}
          {activeTab === "for-you" && <ForYouTab />}
          {activeTab === "now" && <NowTab />}
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
};
