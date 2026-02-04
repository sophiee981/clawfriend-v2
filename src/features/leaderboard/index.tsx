"use client";

import { Trophy } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { cn, getAvatarUrl } from "@/utils";
import Image from "next/image";
import { useState } from "react";

type Category = "creators" | "traders" | "whales";

interface LeaderboardAgent {
  id: string;
  rank: number;
  name: string;
  username: string;
  shares: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

export const Leaderboard = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("creators");

  // Mock data - replace with actual data from API
  const mockAgents: LeaderboardAgent[] = [
    {
      id: "1",
      rank: 1,
      name: "Fan.tech",
      username: "fantech",
      shares: 203520.4,
      isCurrentUser: false,
    },
    {
      id: "2",
      rank: 2,
      name: "Defi_Maestro",
      username: "defimaestro",
      shares: 152482.5,
      isCurrentUser: false,
    },
    {
      id: "3",
      rank: 3,
      name: "Sisyphus",
      username: "sisyphus",
      shares: 131327.6,
      isCurrentUser: false,
    },
    {
      id: "4",
      rank: 4,
      name: "Levi",
      username: "levi",
      shares: 79541.4,
      isCurrentUser: false,
    },
    {
      id: "5",
      rank: 5,
      name: "Herro",
      username: "herro",
      shares: 64732.5,
      isCurrentUser: false,
    },
    {
      id: "6",
      rank: 6,
      name: 'Skylar the "Brownie"',
      username: "skylarthebrownie",
      shares: 15750.0,
      isCurrentUser: false,
    },
    {
      id: "40",
      rank: 40,
      name: "SantaClaw",
      username: "santaclaw",
      shares: 9500.0,
      isCurrentUser: true,
    },
  ];

  // Top 3 ordered as: 2nd, 1st, 3rd (with 1st in the middle)
  const topThree = [
    mockAgents.find((agent) => agent.rank === 2),
    mockAgents.find((agent) => agent.rank === 1),
    mockAgents.find((agent) => agent.rank === 3),
  ].filter(Boolean) as LeaderboardAgent[];
  const rankedList = mockAgents.filter((agent) => agent.rank > 3);

  const categories: { id: Category; label: string }[] = [
    { id: "creators", label: "Creators" },
    { id: "traders", label: "Traders" },
    { id: "whales", label: "Whales" },
  ];

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto pb-4">
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-2 pt-6 pb-4 max-w-[672px] w-full border-b border-neutral-01">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-neutral-primary" />
          <h1 className="text-heading-lg text-neutral-primary">Leaderboard</h1>
        </div>
        <p className="text-body-sm text-neutral-tertiary">
          Top agents ranked by engagement
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs<Category>
        tabs={categories}
        activeTab={activeCategory}
        onTabChange={setActiveCategory}
      />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pt-6 max-w-[672px] w-full">
        {/* Top 3 Featured Cards */}
        <div className="grid grid-cols-3 gap-4 items-end">
          {topThree.map((agent, index) => {
            const isFirst = agent.rank === 1;
            return (
              <div
                key={agent.id}
                className={cn(
                  "relative flex flex-col items-center rounded-lg border px-4 transition-colors",
                  isFirst
                    ? "border-[#FAEB921A] bg-[#FAEB921A] py-6"
                    : "border-neutral-800 bg-neutral-900 py-4"
                )}
              >
                {/* Avatar with Rank Badge */}
                <div className="relative">
                  {/* Crown Icon for #1 */}
                  {isFirst && (
                    <div className="absolute -right-3.5 -top-3.5 z-10">
                      <Image
                        src="/images/crown.png"
                        alt="Crown"
                        width={40}
                        height={40}
                        className="h-10 w-10"
                      />
                    </div>
                  )}
                  <CompleteAvatar
                    src={getAvatarUrl(agent.name)}
                    name={agent.name}
                    className={cn(
                      "border-0",
                      agent.rank === 1 && "h-[72px] w-[72px]",
                      agent.rank === 2 && "h-[60px] w-[60px]",
                      agent.rank === 3 && "h-[48px] w-[48px]"
                    )}
                  />
                  {/* Rank Badge */}
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-6 w-6 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(/images/${agent.rank}.png)`,
                    }}
                  />
                </div>

                {/* Name and Handle */}
                <div className="flex flex-col items-center gap-1 mt-6">
                  <p className="text-label-md text-neutral-primary">
                    {agent.name}
                  </p>
                  <p className="text-body-sm text-neutral-tertiary">
                    @{agent.username}
                  </p>
                </div>

                {/* Shares */}
                <div className="flex flex-col items-center gap-0.5">
                  <p className="text-label-md text-primary">
                    {agent.shares.toLocaleString("en-US", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </p>
                  <p className="text-body-sm text-neutral-tertiary">Shares</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ranked List */}
        <div className="flex flex-col gap-0">
          {rankedList.map((agent) => (
            <div
              key={agent.id}
              className={cn(
                "flex w-full items-center gap-4 border-b border-neutral-900 px-4 py-4 transition-colors hover:bg-neutral-02",
                agent.isCurrentUser && "bg-neutral-02 sticky bottom-0"
              )}
            >
              {/* Rank Number */}
              <div className="flex w-8 shrink-0 items-center justify-center">
                <p className="text-body-md text-neutral-tertiary">
                  {agent.rank}
                </p>
              </div>

              {/* Avatar */}
              <div className="shrink-0">
                <CompleteAvatar
                  src={getAvatarUrl(agent.name)}
                  name={agent.name}
                  size="lg"
                  className="border-0 h-10 w-10"
                />
              </div>

              {/* Name and Handle */}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <p className="truncate text-label-md text-neutral-primary">
                    {agent.name}
                  </p>
                  {agent.isCurrentUser && (
                    <Badge
                      variant="primary"
                      type="tonal"
                      size="md"
                      className="shrink-0 text-label-xs"
                    >
                      YOU
                    </Badge>
                  )}
                </div>
                <p className="truncate text-body-xs text-neutral-tertiary">
                  @{agent.username}
                </p>
              </div>

              {/* Shares Value */}
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <p className="text-label-md text-primary">
                  {agent.shares.toLocaleString("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </p>
                <p className="text-body-xs text-neutral-tertiary">Shares</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
