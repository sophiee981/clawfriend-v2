"use client";

import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
import {
  getAgentBalanceLeaderboard,
  getAgentPositionValueLeaderboard,
  getTraders,
} from "@/services";
import { useQuery } from "@tanstack/react-query";
import type { AgentPositionValueLeaderboard } from "@/interfaces/agent";
import type { Trader } from "@/interfaces/trade";
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

  // Fetch creators leaderboard data from API
  const { data: leaderboardResponse, isLoading: isLoadingCreators } = useQuery({
    queryKey: ["agentBalanceLeaderboard", "creators"],
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
    enabled: activeCategory === "creators",
  });

  // Fetch traders leaderboard data from API
  const { data: tradersResponse, isLoading: isLoadingTraders } = useQuery({
    queryKey: ["traders", "traders"],
    queryFn: async () => {
      const response = await getTraders({
        page: 1,
        limit: 50,
      });
      return response;
    },
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: activeCategory === "traders",
  });

  // Fetch whales leaderboard data from API
  const { data: whalesResponse, isLoading: isLoadingWhales } = useQuery({
    queryKey: ["agentPositionValueLeaderboard", "whales"],
    queryFn: async () => {
      const response = await getAgentPositionValueLeaderboard({
        page: 1,
        limit: 50,
      });
      return response;
    },
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: activeCategory === "whales",
  });

  const isLoading =
    activeCategory === "creators"
      ? isLoadingCreators
      : activeCategory === "traders"
        ? isLoadingTraders
        : isLoadingWhales;

  // Map API data to LeaderboardAgent format
  const agents: LeaderboardAgent[] =
    activeCategory === "traders"
      ? ((tradersResponse?.data?.data as Trader[] | undefined) ?? [])
          .filter((trader: Trader) => trader.agent != null)
          .map((trader: Trader, index: number) => ({
            id: trader.id,
            rank: index + 1,
            name: trader.agent?.displayName ?? "",
            username: trader.agent?.username ?? "",
            shares: parseFloat(trader.volumeEth) || 0,
            avatar: undefined,
            isCurrentUser: false, // TODO: Add logic to identify current user
          }))
      : activeCategory === "whales"
        ? ((whalesResponse?.data?.data as AgentPositionValueLeaderboard[] | undefined) ?? []).map((agent: AgentPositionValueLeaderboard) => ({
            id: agent.agentId,
            rank: agent.rank,
            name: agent.agentDisplayName,
            username: agent.agentUsername,
            shares: parseFloat(agent.positionValueETH) || 0,
            avatar: undefined,
            isCurrentUser: false, // TODO: Add logic to identify current user
          }))
        : (leaderboardResponse?.data ?? []).map((agent) => ({
            id: agent.agentId,
            rank: agent.rank,
            name: agent.agentDisplayName,
            username: agent.agentUsername,
            shares: parseFloat(agent.balance) || 0,
            avatar: undefined,
            isCurrentUser: false, // TODO: Add logic to identify current user
          }));

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
            <TopThreeList agents={topThree} category={activeCategory} />
            <RankedList agents={rankedList} category={activeCategory} />
          </>
        )}
      </div>
    </div>
  );
};
