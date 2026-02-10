"use client";

import { ChainPair } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import type { SubjectHolder } from "@/interfaces/agent";
import { useExchangeRateStore } from "@/stores/exchange-rate.store";
import { getAvatarUrl } from "@/utils";
import { formatNumberShort, formatSmartNumber } from "@/utils/number";
import Link from "next/link";

interface HolderItemProps {
    holder: SubjectHolder;
}

export const HolderItem = ({ holder }: HolderItemProps) => {
    const displayName = holder.displayName || holder.username || "Unknown";
    const balance = formatNumberShort(holder.balance);
    const convertBnbToUsd = useExchangeRateStore(
        (state) => state.convertBnbToUsd,
    );

    const volumeUsd = convertBnbToUsd(holder.subjectShare.volumeBnb);
    const formattedVolume = `$${formatSmartNumber(volumeUsd)}`;
    const valueUsd = convertBnbToUsd(Number(holder.subjectShare.currentPrice) * Number(holder.balance));
    const formattedValueUsd = `$${formatSmartNumber(valueUsd)}`;

    return (
        <div className="flex w-full gap-3 border-b border-neutral-900 p-4 transition-colors hover:bg-neutral-02">
            <div className="shrink-0">
                <Link href={`/profile/${holder.username}`}>
                    <CompleteAvatar
                        src={getAvatarUrl(holder.username)}
                        name={displayName}
                        size="lg"
                        className="h-10 w-10 border-0 cursor-pointer hover:opacity-80 transition-opacity"
                        lastPingAt={holder.lastPingAt}
                    />
                </Link>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                {/* Name and username */}
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Link
                            href={`/profile/${holder.username}`}
                            className="text-body-sm font-medium text-neutral-primary hover:text-primary transition-colors"
                        >
                            {displayName}
                        </Link>
                        <span className="text-body-sm text-neutral-tertiary">
                            @{holder.username}
                        </span>
                    </div>

                </div>

                {/* Balance and price info */}
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-1">
                        <span className="text-body-sm text-primary">{balance}</span>
                        <span className="text-body-xs text-neutral-tertiary">{`${holder.balance > 1 ? "shares" : "share"}`}</span>
                        <div className="w-1 h-1 rounded-full bg-[#717171] flex-shrink-0" />
                        <div className="flex items-center gap-1 flex-shrink-0 text-body-xs">
                            <span className="text-primary text-right">
                                {formatNumberShort(holder.subjectShare.currentPrice)}
                            </span>
                            <div className="flex items-center">
                                <ChainPair className="w-3 h-3" />
                            </div>
                        </div>

                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-body-sm text-neutral-tertiary">Value: <span className="text-neutral-primary">{formattedValueUsd}</span></span>
                        <span className="text-body-sm text-neutral-tertiary">Vol: <span className="text-neutral-primary">{formattedVolume}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};
