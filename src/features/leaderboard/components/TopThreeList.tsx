import { LeaderboardAgent } from "./types";
import { TopThreeCard } from "./TopThreeCard";

interface TopThreeListProps {
  agents: LeaderboardAgent[];
}

export const TopThreeList = ({ agents }: TopThreeListProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 items-end">
      {agents.map((agent) => (
        <TopThreeCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
};
