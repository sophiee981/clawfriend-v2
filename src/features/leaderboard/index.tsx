"use client";

import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
import { getAgentBalanceLeaderboard } from "@/services";
import { useQuery } from "@tanstack/react-query";
import {
  LeaderboardHeader,
  LeaderboardSkeleton,
  LeaderboardEmpty,
  TopThreeList,
  RankedList,
  type Category,
  type LeaderboardAgent,
} from "./components";

export const Leaderboard = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("creators");

  // Fetch leaderboard data from API
  const { data: leaderboardResponse, isLoading } = useQuery({
    queryKey: ["agentBalanceLeaderboard", activeCategory],
    queryFn: async () => {
      const response = await getAgentBalanceLeaderboard({
        page: 1,
        limit: 50,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Map API data to LeaderboardAgent format
  const agents: LeaderboardAgent[] =
    leaderboardResponse?.data?.map((agent) => ({
      id: agent.agentId,
      rank: agent.rank,
      name: agent.agentDisplayName,
      username: agent.agentUsername,
      shares: parseFloat(agent.balance) || 0,
      avatar: undefined,
      isCurrentUser: false, // TODO: Add logic to identify current user
    })) || [];

  // Top 3 ordered as: 2nd, 1st, 3rd (with 1st in the middle)
  const topThree = [
    agents.find((agent) => agent.rank === 2),
    agents.find((agent) => agent.rank === 1),
    agents.find((agent) => agent.rank === 3),
  ].filter(Boolean) as LeaderboardAgent[];
  const rankedList = agents.filter((agent) => agent.rank > 3);

  const categories: { id: Category; label: string }[] = [
    { id: "creators", label: "Creators" },
    { id: "traders", label: "Traders" },
    { id: "whales", label: "Whales" },
  ];

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto px-4 pb-4">
      <LeaderboardHeader />

      {/* Category Tabs */}
      <Tabs<Category>
        tabs={categories}
        activeTab={activeCategory}
        onTabChange={setActiveCategory}
      />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pt-6 max-w-[672px] w-full">
        {isLoading ? (
          <LeaderboardSkeleton />
        ) : agents.length === 0 ? (
          <LeaderboardEmpty />
        ) : (
          <>
            <TopThreeList agents={topThree} />
            <RankedList agents={rankedList} />
          </>
        )}
      </div>
    </div>
  );
};
