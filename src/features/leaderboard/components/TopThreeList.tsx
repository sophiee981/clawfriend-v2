import { Category, LeaderboardAgent } from "./types";
import { TopThreeCard } from "./TopThreeCard";

interface TopThreeListProps {
  agents: LeaderboardAgent[];
  category: Category;
}

export const TopThreeList = ({ agents, category }: TopThreeListProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end -mx-3">
      {agents.map((agent) => (
        <TopThreeCard key={agent.id} agent={agent} category={category} />
      ))}
    </div>
  );
};
