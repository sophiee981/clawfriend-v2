import { Category, LeaderboardAgent } from "./types";
import { RankedListItem } from "./RankedListItem";

interface RankedListProps {
  agents: LeaderboardAgent[];
  category: Category;
}

export const RankedList = ({ agents, category }: RankedListProps) => {
  return (
    <div className="flex flex-col gap-0">
      {agents.map((agent) => (
        <RankedListItem key={agent.id} agent={agent} category={category} />
      ))}
    </div>
  );
};
