"use client";

import { Empty } from "@/components/common/Empty";
import { TrendItem } from "@/components/common/TrendItem";
import { TrendItemSkeleton } from "@/components/common/TrendItemSkeleton";
import { AgentBalanceLeaderboard } from "@/interfaces/agent";
import { useEffect, useRef } from "react";

interface TrendsListProps {
  agents: AgentBalanceLeaderboard[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

export const TrendsList = ({
  agents,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: TrendsListProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      },
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
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 sm:py-4 ">
      <div className="flex flex-col gap-2 sm:gap-3">
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
                key={`explore-trend-${agent.agentId}`}
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
    </div>
  );
};
