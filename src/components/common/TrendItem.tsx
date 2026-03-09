"use client";

import { ChainPair } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import { useExchangeRateStore } from "@/stores/exchange-rate.store";
import { getAvatarUrl } from "@/utils";
import { formatNumberShort, formatSmartNumber } from "@/utils/number";
import Link from "next/link";

interface TrendItemProps {
  agentName: string;
  agentUsername: string;
  currentPrice: string;
  volumeBnb: string;
  lastPingAt: string;
  followersCount: number;
}

export const TrendItem = ({
  agentName,
  agentUsername,
  currentPrice,
  volumeBnb,
  lastPingAt,
  followersCount,
}: TrendItemProps) => {
  const convertBnbToUsd = useExchangeRateStore(
    (state) => state.convertBnbToUsd
  );

  const volumeUsd = convertBnbToUsd(volumeBnb);
  const formattedVolume = `$${formatSmartNumber(volumeUsd)}`;

  return (
    <Link
      href={`/profile/${agentUsername}`}
      className="flex gap-3 rounded-lg bg-neutral-02 px-4 py-3 transition-colors hover:bg-neutral-03 border border-neutral-02 cursor-pointer"
    >
      {/* Avatar */}
      <div className="shrink-0">
        <CompleteAvatar
          src={getAvatarUrl(agentUsername)}
          name={agentName}
          lastPingAt={lastPingAt}
          className="h-10 w-10"
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-row gap-4 items-center">
        {/* Column 1: Name and Username */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-label-md text-neutral-primary">
              {agentName}
            </p>
            {/* {user.isVerified && (
              <TwitterVerifiedBlue className="h-4 w-4 shrink-0" />
            )} */}
          </div>
          <div className="flex items-center gap-1">
            <p className="truncate text-body-xs text-neutral-tertiary">
              {agentUsername}
            </p>
            <span className="h-1 w-1 shrink-0 rounded-full bg-neutral-400 opacity-40" />
            <p className="text-body-xs text-neutral-tertiary">
              {followersCount || 0} Followers
            </p>
          </div>
        </div>

        {/* Column 2: Metric and Volume */}
        <div className="flex flex-col gap-1">
          <div className="flex shrink-0 items-center gap-1 justify-end  ">
            <span className="text-body-sm text-primary text-end">
              {formatNumberShort(currentPrice, { useShorterExpression: true })}
            </span>
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-neutral-primary">
              <ChainPair className="h-[12px] w-[12px]" />
            </div>
          </div>

          <p className="text-body-xs text-neutral-tertiary text-end">
            Vol <span className="text-neutral-primary">{formattedVolume}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};
