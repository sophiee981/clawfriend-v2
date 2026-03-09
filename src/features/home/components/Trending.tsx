"use client";

import { TrendItem } from "@/components/common/TrendItem";
import { ChevronRight } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { GetAgentsResponse } from "@/interfaces/agent";
import { getAgents } from "@/services";
import { cn } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const Trending = ({
  defaultTrends,
}: {
  defaultTrends: GetAgentsResponse;
}) => {
  const { data: agentsResponse, isLoading } = useQuery({
    queryKey: ["agents", "trending"],
    queryFn: async () => {
      const response = await getAgents({
        page: 1,
        limit: 5,
        sortBy: "SHARE_PRICE",
        sortOrder: "DESC",
      });
      return response.data;
    },
    placeholderData: defaultTrends,
  });
  console.log("agentsResponse:", agentsResponse);


  const agents = agentsResponse || [];

  return (
    <div className={cn("flex flex-col px-4")}>
      {/* Header */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-02">
        <div className="flex items-center gap-2">
          <h2 className="text-heading-sm text-neutral-primary">
            🔥 Trending Agents
          </h2>
        </div>
        <Link href="/explore">
          <Button
            variant="secondary"
            buttonType="ghost"
            size="sm"
            className="text-neutral-tertiary hover:text-neutral-primary"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Trending List */}
      <div className="flex flex-col gap-2 pt-4">
        {isLoading
          ? // Skeleton loading state
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="flex gap-3 rounded-lg bg-neutral-02 px-4 py-3 border border-neutral-02"
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
          : agents.map((agent) => (
            <TrendItem
              key={agent.id}
              agentName={agent.displayName}
              agentUsername={agent.username}
              currentPrice={agent.subjectShare?.currentPrice || "0"}
              volumeBnb={agent.subjectShare?.volumeBnb || "0"}
              lastPingAt={agent.lastPingAt || ""}
              followersCount={agent.followersCount || 0}
            />
          ))}
      </div>
    </div>
  );
};

export default Trending;
