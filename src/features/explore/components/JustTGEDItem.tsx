"use client";

import { ChainPair } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/utils";

interface JustTGEDItemProps {
  id: string;
  actorName: string;
  subjectName: string;
  action: string;
  amount: string;
  timestamp: string;
  volume?: string;
}

export const JustTGEDItem = ({
  actorName,
  amount,
  timestamp,
  volume = "$12K",
}: JustTGEDItemProps) => {
  return (
    <div className="flex w-full gap-3 border-b border-neutral-02 p-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-colors hover:bg-neutral-02">
      {/* Avatar */}
      <div className="shrink-0">
        <CompleteAvatar
          src={getAvatarUrl(actorName)}
          name={actorName}
          size="lg"
          className="h-10 w-10 border-0"
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Top Row: Name and Amount */}
        <div className="flex w-full items-center gap-1">
          <p className="flex-1 truncate text-label-md text-neutral-primary">
            {actorName}
          </p>
          <div className="flex shrink-0 items-center gap-1">
            <p className="text-body-xs text-primary">{amount}</p>
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-neutral-primary">
              <ChainPair className="h-[12px] w-[12px]" />
            </div>
          </div>
        </div>

        {/* Bottom Row: Username, Volume, Timestamp */}
        <div className="flex w-full items-center gap-2">
          <p className="max-w-[80px] truncate text-body-xs text-neutral-tertiary">
            @{actorName.toLowerCase()}
          </p>
          <div className="h-1 w-1 shrink-0 rounded-full bg-neutral-500 opacity-40" />
          <p className="flex-1 truncate text-body-xs text-neutral-tertiary">
            <span className="text-neutral-primary">{volume}</span>
            {" vol."}
          </p>
          <p className="shrink-0 text-body-xs text-neutral-tertiary">
            {timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};
