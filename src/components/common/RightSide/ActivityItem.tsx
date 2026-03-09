"use client";

import { ChainPair, ExternalLink } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import type { Trade } from "@/interfaces/trade";
import { cn, formatTimestamp, getAvatarUrl } from "@/utils";
import { formatNumberShort } from "@/utils/number";
import { formatAddress } from "@/utils/web3";
import Link from "next/link";
import { getActionColor, getTransactionUrl } from "./rightSideUtils";

interface ActivityItemProps {
  activity: Trade;
}

export const ActivityItem = ({ activity }: ActivityItemProps) => {
  const actorName =
    activity.trader.displayName ||
    activity.trader.username ||
    (activity.trader.address
      ? formatAddress(activity.trader.address, 3)
      : null) ||
    "Unknown";
  const subjectName =
    activity.subject.displayName || activity.subject.username || "Unknown";
  const actorUsername = activity.trader.username || "";
  const subjectUsername = activity.subject.username || "";
  const amount = formatNumberShort(activity.bnbAmount);
  const timestamp = formatTimestamp(activity.blockTimestamp);
  const transactionLink = getTransactionUrl(activity.transactionHash);

  const isWalletOnlyActor =
    activity.trader.address &&
    !activity.trader.username &&
    !activity.trader.displayName;

  const actorLink = isWalletOnlyActor
    ? `/wallet/${activity.trader.address}`
    : `/profile/${actorUsername}`;

  return (
    <div className="flex w-full gap-3 border-b border-neutral-02 p-4 transition-colors hover:bg-neutral-02">
      <div className="relative shrink-0 h-10">
        <Link href={actorLink}>
          <CompleteAvatar
            src={
              activity.trader.avatarUrl ||
              getAvatarUrl(actorUsername || actorName)
            }
            name={actorName}
            size="lg"
            className="h-10 w-10 border-0 cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>

        <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-neutral-02">
          <Link href={subjectUsername ? `/profile/${subjectUsername}` : "#"}>
            <CompleteAvatar
              src={activity.subject.avatarUrl || getAvatarUrl(subjectUsername)}
              name={subjectName}
              size="sm"
              className="h-4 w-4 border-0 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex w-full items-center gap-1">
          <p className="text-body-sm text-neutral-primary">
            <Link
              href={actorLink}
              className="font-medium hover:text-primary transition-colors"
            >
              {actorName}
            </Link>{" "}
            <span
              className={cn("font-medium", getActionColor(activity.action))}
            >
              {activity.action} {formatNumberShort(activity.shareAmount)}
            </span>{" "}
            <Link
              href={subjectUsername ? `/profile/${subjectUsername}` : "#"}
              className="font-medium hover:text-primary transition-colors"
            >
              {subjectName}
            </Link>
            's share
          </p>
        </div>

        <div className="flex w-full items-center gap-1.5">
          <p className="text-body-xs text-primary">{amount}</p>
          <div className="flex h-3 w-3 items-center justify-center rounded-full bg-neutral-primary">
            <ChainPair className="h-[12px] w-[12px]" />
          </div>
          <div className="h-1 w-1 shrink-0 rounded-full bg-neutral-500 opacity-40" />
          <p className="text-body-xs text-neutral-tertiary">{timestamp}</p>
        </div>
      </div>

      <a
        href={transactionLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0 items-center gap-1 text-body-xs text-neutral-tertiary hover:text-neutral-primary transition-colors"
      >
        <span>Tx</span>
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
};
