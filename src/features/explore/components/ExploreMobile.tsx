"use client";

import { Empty } from "@/components/common/Empty";
import { TrendItem } from "@/components/common/TrendItem";
import { TrendItemSkeleton } from "@/components/common/TrendItemSkeleton";
import { Tabs } from "@/components/ui/tabs";
import { AgentBalanceLeaderboard } from "@/interfaces/agent";
import { useEffect, useRef, useState } from "react";
import { ActivitiesTab } from "./ActivitiesTab";
import { JustTGEDTab } from "./JustTGEDTab";

type ActivityAction = "bought" | "bid" | "sold" | "airdropped";

interface ActivityItem {
  id: string;
  actorName: string;
  subjectName: string;
  action: ActivityAction;
  amount: string;
  timestamp: string;
  transactionLink?: string;
}

type TabId = "just-tged" | "activities" | "trending";

interface ExploreMobileProps {
  agents?: AgentBalanceLeaderboard[];
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

const ExploreMobile = ({
  agents = [],
  isLoading = false,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: ExploreMobileProps = {}) => {
  const [activeTab, setActiveTab] = useState<TabId>("just-tged");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Mock data - replace with actual data from API
  const mockActivities: ActivityItem[] = [
    {
      id: "1",
      actorName: "Chairman",
      subjectName: "olimpio",
      action: "bought",
      amount: "0.0048",
      timestamp: "1d ago",
    },
    {
      id: "2",
      actorName: "Chairman",
      subjectName: "Small Cap",
      action: "bid",
      amount: "0.0048",
      timestamp: "1d ago",
    },
    {
      id: "3",
      actorName: "Yoh879",
      subjectName: "Chairman",
      action: "sold",
      amount: "0.0048",
      timestamp: "1d ago",
    },
    {
      id: "4",
      actorName: "TheHawk",
      subjectName: "Chairman",
      action: "airdropped",
      amount: "0.0048",
      timestamp: "1d ago",
    },
    {
      id: "5",
      actorName: "Adrian",
      subjectName: "Chark Beagle",
      action: "bought",
      amount: "0.0048",
      timestamp: "1d ago",
    },
    {
      id: "6",
      actorName: "Goat",
      subjectName: "Small Cap",
      action: "bid",
      amount: "0.0048",
      timestamp: "1d ago",
    },
    {
      id: "7",
      actorName: "Claud",
      subjectName: "olimpio",
      action: "sold",
      amount: "0.0048",
      timestamp: "1d ago",
    },
    {
      id: "8",
      actorName: "Claudecraft",
      subjectName: "Chairman",
      action: "airdropped",
      amount: "0.0048",
      timestamp: "1d ago",
    },
    {
      id: "9",
      actorName: "Kurt",
      subjectName: "Adrian",
      action: "bought",
      amount: "0.0048",
      timestamp: "1d ago",
    },
    {
      id: "10",
      actorName: "John",
      subjectName: "TheHawk",
      action: "bid",
      amount: "0.0048",
      timestamp: "1d ago",
    },
  ];

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
                    walletAddress={agent.walletAddress}
                    balance={agent.balance}
                    volumeEth={agent.volumeEth}
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
          <ActivitiesTab activities={mockActivities} />
        ) : (
          <JustTGEDTab activities={mockActivities} />
        )}
      </div>
    </div>
  );
};

export default ExploreMobile;
