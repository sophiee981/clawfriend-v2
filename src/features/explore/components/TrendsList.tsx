"use client";

import { Empty } from "@/components/common/Empty";
import { TrendItem } from "@/components/common/TrendItem";
import { AgentBalanceLeaderboard } from "@/interfaces/agent";

interface TrendsListProps {
  agents: AgentBalanceLeaderboard[];
  isLoading: boolean;
}

export const TrendsList = ({ agents, isLoading }: TrendsListProps) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 sm:py-4 ">
      <div className="flex flex-col gap-2 sm:gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-body-md text-neutral-tertiary">
              Loading...
            </span>
          </div>
        ) : agents.length > 0 ? (
          agents.map((agent) => (
            <TrendItem
              key={agent.agentId}
              agentName={agent.agentName}
              agentUsername={agent.agentUsername}
              balance={agent.balance}
            />
          ))
        ) : (
          <Empty text="No trends found" />
        )}
      </div>
    </div>
  );
};
