"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import {
  TabNavigation,
  TrendingTab,
  ForYouTab,
  NowTab,
  RightSidebar,
} from "./components";
import { useExchangeRateStore } from "@/stores/exchange-rate.store";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { ScrollButton } from "@/components/common/ScrollButton";

type TabType = "trending" | "for-you" | "now";

const VALID_TABS: TabType[] = ["trending", "for-you", "now"];

export const Feeds = () => {
  const { fetchExchangeRate } = useExchangeRateStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get tab from URL or default to "trending"
  const getInitialTab = (): TabType => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl as TabType)) {
      return tabFromUrl as TabType;
    }
    return "trending";
  };

  // Use scroll to top hook
  const { showScrollTop, scrollToTop } = useScrollToTop({
    containerSelector: '.scroll-container',
    threshold: 300,
    behavior: "smooth",
  });

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);
  const contentRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "trending" as TabType, label: "Trending" },
    // { id: "for-you" as TabType, label: "For you" },
    { id: "now" as TabType, label: "Now" },
  ];

  const handleTabChange = (tabId: string) => {
    const newTab = tabId as TabType;
    setActiveTab(newTab);

    // Update URL with new tab - always include tab param
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });

    // Scroll to top when tab changes
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Ensure URL always has tab param, redirect if missing
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");

    // If no tab param in URL, redirect to default tab
    if (!tabFromUrl) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", "trending");
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
      return;
    }

    // Validate and sync tab from URL
    const newTab: TabType = VALID_TABS.includes(tabFromUrl as TabType)
      ? (tabFromUrl as TabType)
      : "trending";

    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  return (
    <div className="flex h-screen">
      {/* Left Content */}
      <div className="flex flex-1 flex-col min-w-0 border border-neutral-900 relative">
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
          className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide scroll-container"
        >
          {activeTab === "trending" && <TrendingTab />}
          {activeTab === "for-you" && <ForYouTab />}
          {activeTab === "now" && <NowTab />}
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <div className="sm:flex hidden sticky bottom-5 justify-center z-50 pointer-events-none">
            <ScrollButton scrollToTop={scrollToTop} />
          </div>
        )}
      </div>
      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
};
