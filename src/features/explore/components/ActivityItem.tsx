"use client";

import { ChainPair, ExternalLink } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import { cn, getAvatarUrl } from "@/utils";

type ActivityAction = "bought" | "bid" | "sold" | "airdropped";

interface ActivityItemProps {
  id: string;
  actorName: string;
  subjectName: string;
  action: ActivityAction;
  amount: string;
  timestamp: string;
  transactionLink?: string;
}

const getActionColor = (action: ActivityAction): string => {
  switch (action) {
    case "bought":
      return "text-success";
    case "bid":
      return "text-info";
    case "sold":
      return "text-danger";
    case "airdropped":
      return "text-indigo";
    default:
      return "text-neutral-primary";
  }
};

export const ActivityItem = ({
  actorName,
  subjectName,
  action,
  amount,
  timestamp,
  transactionLink,
}: ActivityItemProps) => {
  return (
    <div className="flex w-full gap-3 border-b border-neutral-02 p-4 transition-colors hover:bg-neutral-02">
      {/* Avatars - Primary with Secondary Overlaid */}
      <div className="relative shrink-0">
        <CompleteAvatar
          src={getAvatarUrl(actorName)}
          name={actorName}
          size="lg"
          className="h-10 w-10 border-0"
        />
        {/* Secondary Avatar Overlaid */}
        <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-neutral-02">
          <CompleteAvatar
            src={getAvatarUrl(subjectName)}
            name={subjectName}
            size="sm"
            className="h-4 w-4 border-0"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Top Row: Activity Description */}
        <div className="flex w-full items-center gap-1">
          <p className="text-body-sm text-neutral-primary">
            <span className="font-medium">{actorName}</span>{" "}
            <span className={cn("font-medium", getActionColor(action))}>
              {action}
            </span>{" "}
            <span className="font-medium">{subjectName}</span>
            's share
          </p>
        </div>

        {/* Bottom Row: Amount, Icon, Timestamp */}
        <div className="flex w-full items-center gap-1.5">
          <p className="text-body-xs text-primary">{amount}</p>
          <div className="flex h-3 w-3 items-center justify-center rounded-full bg-neutral-primary">
            <ChainPair className="h-[12px] w-[12px]" />
          </div>
          <div className="h-1 w-1 shrink-0 rounded-full bg-neutral-500 opacity-40" />
          <p className="text-body-xs text-neutral-tertiary">{timestamp}</p>
        </div>
      </div>

      {/* Transaction Link */}
      {transactionLink ? (
        <a
          href={transactionLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1 text-body-xs text-neutral-tertiary hover:text-neutral-primary transition-colors"
        >
          <span>Tx</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <div className="flex shrink-0 items-center gap-1 text-body-xs text-neutral-tertiary">
          <span>Tx</span>
          <ExternalLink className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};
