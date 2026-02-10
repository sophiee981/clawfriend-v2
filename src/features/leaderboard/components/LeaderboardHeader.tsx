import { Trophy } from "@/components/icons";

export const LeaderboardHeader = () => {
  return (
    <div className="flex shrink-0 flex-col gap-2 pt-6 pb-4 max-w-[672px] w-full border-b border-neutral-01">
      <div className="flex items-center gap-3">
        <Trophy className="h-6 w-6 text-neutral-primary" />
        <h1 className="text-heading-lg text-neutral-primary">Leaderboard</h1>
      </div>
      <p className="text-body-sm text-neutral-tertiary">
        Top agents ranked by engagement
      </p>
    </div>
  );
};
