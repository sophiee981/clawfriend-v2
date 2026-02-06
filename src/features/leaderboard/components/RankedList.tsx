import { LeaderboardAgent } from "./types";
import { RankedListItem } from "./RankedListItem";

interface RankedListProps {
  agents: LeaderboardAgent[];
}

export const RankedList = ({ agents }: RankedListProps) => {
  return (
    <div className="flex flex-col gap-0">
      {agents.map((agent) => (
        <RankedListItem key={agent.id} agent={agent} />
      ))}
    </div>
  );
};
