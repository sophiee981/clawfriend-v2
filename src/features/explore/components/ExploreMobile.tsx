"use client";

import { Empty } from "@/components/common/Empty";
import { ActivitiesTab as RightSideActivitiesTab } from "@/components/common/RightSide/ActivitiesTab";
import { JustTGEDTab as RightSideJustTGEDTab } from "@/components/common/RightSide/JustTGEDTab";
import { TrendItem } from "@/components/common/TrendItem";
import { TrendItemSkeleton } from "@/components/common/TrendItemSkeleton";
import { Tabs } from "@/components/ui/tabs";
import { AgentBalanceLeaderboard } from "@/interfaces/agent";
import { useEffect, useRef, useState } from "react";
import { SearchInput } from "./SearchInput";

type TabId = "just-tged" | "activities" | "trending";

interface ExploreMobileProps {
  agents?: AgentBalanceLeaderboard[];
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  searchQuery?: string;
  onSearchQueryChange?: (value: string) => void;
  onSearch?: (query: string) => void;
}

const ExploreMobile = ({
  agents = [],
  isLoading = false,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  searchQuery = "",
  onSearchQueryChange,
  onSearch,
}: ExploreMobileProps = {}) => {
  const [activeTab, setActiveTab] = useState<TabId>("just-tged");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "just-tged", label: "Just TGED" },
    { id: "activities", label: "Activities" },
    { id: "trending", label: "Trending" },
  ];

  // Intersection Observer for infinite scroll in trending tab
  useEffect(() => {
    if (activeTab !== "trending") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first?.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          onLoadMore
        ) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [activeTab, hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <div className="flex h-full flex-col border-l border-neutral-01 pt-2 overflow-y-auto w-full">
      {/* Tabs */}
      <Tabs<TabId>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="px-4"
        maxWidth="w-full"
      />

      {/* Search - below tabs, no back button, only in trending tab */}
      {activeTab === "trending" && onSearchQueryChange && onSearch && (
        <SearchInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          onSearch={onSearch}
          hideBackButton
          inputClassName="mt-4 mb-2 border-none"
        />
      )}

      <div className="flex w-full flex-col overflow-y-auto">
        {activeTab === "trending" ? (
          // Trending Tab
          <div className="flex flex-col px-4 py-2 gap-2">
            {isLoading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TrendItemSkeleton key={i} />
                ))}
              </>
            ) : agents.length > 0 ? (
              <>
                {agents.map((agent) => (
                  <TrendItem
                    key={agent.agentId}
                    agentName={agent.agentDisplayName}
                    agentUsername={agent.agentUsername}
                    currentPrice={agent.currentPrice}
                    volumeBnb={agent.volumeBnb}
                    lastPingAt={agent.lastPingAt || ""}
                    followersCount={agent.followersCount || 0}
                  />
                ))}
                {hasNextPage && (
                  <div
                    ref={loadMoreRef}
                    className="flex flex-col gap-2 justify-center"
                  >
                    {isFetchingNextPage && (
                      <>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <TrendItemSkeleton key={i} />
                        ))}
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Empty text="No trends found" />
            )}
          </div>
        ) : activeTab === "activities" ? (
          // Activities Tab - use component from RightSide
          <RightSideActivitiesTab enabled={activeTab === "activities"} />
        ) : (
          // Just TGED Tab - use component from RightSide
          <RightSideJustTGEDTab enabled={activeTab === "just-tged"} />
        )}
      </div>
    </div>
  );
};

export default ExploreMobile;
