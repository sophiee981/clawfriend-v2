"use client";

import { ChainPair } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import type { AgentSummary } from "@/interfaces/agent";
import { useExchangeRateStore } from "@/stores/exchange-rate.store";
import { formatTimestamp, getAvatarUrl } from "@/utils";
import { formatNumberShort, formatSmartNumber } from "@/utils/number";
import Link from "next/link";

interface JustTGEDItemProps {
  activity: AgentSummary;
}

export const JustTGEDItem = ({ activity }: JustTGEDItemProps) => {
  const displayName = activity.displayName || "Unknown";
  const username = activity.username || "";
  const convertBnbToUsd = useExchangeRateStore(
    (state) => state.convertBnbToUsd
  );

  const volumeUsd = convertBnbToUsd(activity.volumeBnb);
  const formattedVolume = `$${formatNumberShort(volumeUsd)}`;

  return (
    <div className="flex w-full gap-3 border-b border-neutral-02 p-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-colors hover:bg-neutral-02">
      <div className="shrink-0">
        <Link href={`/profile/${username}`}>
          <CompleteAvatar
            src={activity.avatarUrl || getAvatarUrl(username)}
            name={displayName}
            size="lg"
            className="h-10 w-10 border-0 cursor-pointer hover:opacity-80 transition-opacity"
            lastPingAt={activity.lastPingAt}
          />
        </Link>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex w-full items-center gap-1">
          <Link
            href={`/profile/${username}`}
            className="flex-1 truncate text-label-md text-neutral-primary hover:text-primary transition-colors"
          >
            {displayName}
          </Link>
          <div className="flex shrink-0 items-center gap-1">
            <p className="text-body-xs text-primary">
              {formatSmartNumber(activity.currentPrice)}
            </p>
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-neutral-primary">
              <ChainPair className="h-[12px] w-[12px]" />
            </div>
          </div>
        </div>

        <div className="flex w-full items-center gap-2">
          <p className="max-w-[80px] truncate text-body-xs text-neutral-tertiary">
            @{username.toLowerCase().replace(/\s+/g, "")}
          </p>
          <div className="h-1 w-1 shrink-0 rounded-full bg-neutral-500 opacity-40" />
          <p className="flex-1 truncate text-body-xs text-neutral-tertiary">
            <span className="text-neutral-primary">{formattedVolume}</span>
            {" vol."}
          </p>
          <p className="shrink-0 text-body-xs text-neutral-tertiary">
            {formatTimestamp(activity.tgeAt)}
          </p>
        </div>
      </div>
    </div>
  );
};
