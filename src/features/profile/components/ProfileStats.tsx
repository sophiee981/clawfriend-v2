"use client";

import { ChainPair } from "@/components/icons";
import { useState } from "react";
import { cn } from "@/utils";
import { formatNumberShort } from "@/utils/number";

interface ProfileStatsProps {
  yourShare: number
  sharePrice: string;
  tradingVol: string;
  holdingValue: string;
  earnings: number;
  totalSupply: number;
  totalHolder: number;
}

interface StatItemProps {
  label: string;
  value: string;
  hasChainIcon?: boolean;
  className?: string;
}

const StatItem = ({ label, value, hasChainIcon, className }: StatItemProps) => (
  <div className={cn("flex flex-col gap-1 px-4 py-3", className)}>
    <div className="flex items-center gap-1">
      <span className="text-[15px] font-medium leading-5 text-neutral-primary">
        {value}
      </span>
      {hasChainIcon && (
        <div className="flex items-center pt-0.5">
          <ChainPair className="w-3 h-3" />
        </div>
      )}
    </div>
    <span className="text-[13px] leading-4 text-neutral-tertiary">{label}</span>
  </div>
);

export const ProfileStats = ({ sharePrice, tradingVol, holdingValue, earnings, yourShare, totalSupply, totalHolder }: ProfileStatsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border border-neutral-900 rounded-lg overflow-hidden">
      {/* Top Row */}
      <div className="flex items-center border-b border-neutral-900">
        <div className="flex-1 border-r border-neutral-900">
          <StatItem label="Share Price" value={formatNumberShort(sharePrice)} hasChainIcon />
        </div>
        <div className="flex-1 px-4 py-3">
          <div className="flex items-start gap-1 text-[15px] leading-5">
            <span className="text-neutral-primary font-medium">{totalSupply}</span>
            <span className="text-neutral-tertiary">Shares</span>
            <span className="text-neutral-tertiary">/</span>
            <span className="text-neutral-primary font-medium">{totalHolder}</span>
            <span className="text-neutral-tertiary">Holders</span>
          </div>
          <div className="flex items-center gap-1 text-[13px] leading-4 text-neutral-tertiary mt-1">
            <span>You own</span>
            <span className="text-neutral-primary">{yourShare}</span>
            <span>Share</span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center px-4 py-3 hover:bg-neutral-900 transition-colors"
        >
          <svg
            className={cn(
              "w-5 h-5 text-neutral-tertiary transition-transform",
              isExpanded ? "rotate-180" : ""
            )}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Expandable Stats */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col">
            {/* Row 2 */}
            <div className="flex items-stretch border-b border-neutral-900">
              <div className="flex-1 border-r border-neutral-900">
                <StatItem label="Trading Vol" value={formatNumberShort(tradingVol)} hasChainIcon />
              </div>
              <div className="flex-1 border-r border-neutral-900">
                <StatItem label="Earnings" value={formatNumberShort(earnings)} hasChainIcon />
              </div>
              <div className="flex-1 border-r border-neutral-900">
                <StatItem label="Holding Value" value={formatNumberShort(holdingValue)} hasChainIcon />
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
