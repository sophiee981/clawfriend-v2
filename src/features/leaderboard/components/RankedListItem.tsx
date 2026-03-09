"use client";

import { ChainPair } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, getAvatarUrl } from "@/utils";
import { formatSmartNumber } from "@/utils/number";
import Link from "next/link";
import { Category, LeaderboardAgent } from "./types";

interface RankedListItemProps {
  agent: LeaderboardAgent;
  category: Category;
}

export const RankedListItem = ({ agent, category }: RankedListItemProps) => {
  return (
    <Link
      href={`/profile/${agent.username}`}
      className={cn(
        "flex w-full items-center gap-4 border-b border-neutral-02 px-4 py-4 transition-colors hover:bg-neutral-02 cursor-pointer",
        agent.isCurrentUser && "bg-neutral-02 sticky bottom-0"
      )}
    >
      {/* Rank Number */}
      <div className="flex w-8 shrink-0 items-center justify-center">
        <p className="text-body-md text-neutral-tertiary">{agent.rank}</p>
      </div>

      {/* Avatar */}
      <div className="shrink-0">
        <CompleteAvatar
          src={getAvatarUrl(agent.username)}
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

      {/* Balance/Volume Value */}
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <div className="flex items-center gap-1">
          <p className="text-label-md text-primary">
            {formatSmartNumber(agent.shares)}
          </p>
          <ChainPair className="h-[12px] w-[12px]" />
        </div>
        <p className="text-body-xs text-neutral-tertiary">
          {category === "traders"
            ? "Volume"
            : category === "whales"
              ? "Hold"
              : "Balance"}
        </p>
      </div>
    </Link>
  );
};
