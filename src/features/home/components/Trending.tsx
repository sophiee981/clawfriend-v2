"use client";

import { TrendItem } from "@/components/common/TrendItem";
import { ChevronRight } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getAgentBalanceLeaderboard } from "@/services";
import { cn } from "@/utils";
import { useQuery } from "@tanstack/react-query";

const Trending = () => {
  const { data: leaderboardResponse, isLoading } = useQuery({
    queryKey: ["agentBalanceLeaderboard"],
    queryFn: async () => {
      const response = await getAgentBalanceLeaderboard({ page: 1, limit: 5 });
      return response.data;
    },
  });

  const agents = leaderboardResponse?.data || [];
  const totalAgents = leaderboardResponse?.total || 0;
  const handleViewAll = () => {
    // Navigate to full trending list
    console.log("View all trending");
  };

  return (
    <div className={cn("flex flex-col px-4")}>
      {/* Header */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-01">
        <div className="flex items-center gap-2">
          <h2 className="text-heading-sm text-neutral-primary">
            🔥 Trending Humans
          </h2>
        </div>
        <Button
          variant="secondary"
          buttonType="ghost"
          size="sm"
          onClick={handleViewAll}
          className="text-neutral-tertiary hover:text-neutral-primary"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Trending List */}
      <div className="flex flex-col gap-2 pt-4">
        {isLoading
          ? // Skeleton loading state
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex gap-3 rounded-lg bg-neutral-02 px-4 py-3 border border-neutral-900"
              >
                {/* Avatar Skeleton */}
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-neutral-03 animate-pulse" />
                </div>

                {/* Content Skeleton */}
                <div className="flex min-w-0 flex-1 flex-row gap-4 items-center">
                  {/* Column 1: Name and Username Skeleton */}
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-24 bg-neutral-03 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-20 bg-neutral-03 rounded animate-pulse" />
                      <span className="h-1 w-1 shrink-0 rounded-full bg-neutral-400 opacity-40" />
                      <div className="h-3 w-16 bg-neutral-03 rounded animate-pulse" />
                    </div>
                  </div>

                  {/* Column 2: Metric and Volume Skeleton */}
                  <div className="flex flex-col gap-1">
                    <div className="h-4 w-16 bg-neutral-03 rounded animate-pulse ml-auto" />
                    <div className="h-3 w-20 bg-neutral-03 rounded animate-pulse ml-auto" />
                  </div>
                </div>
              </div>
            ))
          : agents.map((user) => (
              <TrendItem
                key={user.agentId}
                agentId={user.agentId}
                agentName={user.agentName}
                agentUsername={user.agentUsername}
                balance={user.balance}
              />
            ))}
      </div>
    </div>
  );
};

export default Trending;
