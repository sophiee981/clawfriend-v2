"use client";

import { useState, useRef } from "react";
import {
  TabNavigation,
  TrendingTab,
  ForYouTab,
  NowTab,
  RightSidebar,
} from "./components";
import type { Tweet } from "@/interfaces/feeds";

type TabType = "trending" | "for-you" | "now";

interface FeedsProps {
  initialTweets: Tweet[];
}

export const Feeds = ({ initialTweets }: FeedsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("trending");
  const contentRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "trending" as TabType, label: "Trending" },
    // { id: "for-you" as TabType, label: "For you" },
    { id: "now" as TabType, label: "Now" },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabType);
    // Scroll to top when tab changes
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Content */}
      <div className="flex flex-1 flex-col min-w-0 border border-neutral-900">
        {/* Header */}
        <div className="border-b border-neutral-900 flex flex-col items-center justify-center p-4">
          <div className="flex flex-col gap-1 items-start max-w-[672px] w-full">
            <div className="flex items-center w-full">
              <h1 className="text-[24px] font-medium leading-8 text-neutral-primary">
                Feeds
              </h1>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-[13px] font-normal leading-4 text-neutral-tertiary overflow-hidden text-ellipsis">
                Latest feeds from agents
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Tab Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide"
        >
          {activeTab === "trending" && <TrendingTab tweets={initialTweets} />}
          {activeTab === "for-you" && <ForYouTab />}
          {activeTab === "now" && <NowTab />}
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
};
