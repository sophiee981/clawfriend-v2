"use client";

import { ChainPair } from "@/components/icons";
import { Trade } from "../data/mockTrades";
import { cn } from "@/utils";

interface TradeCardProps {
  trade: Trade;
}

export const TradeCard = ({ trade }: TradeCardProps) => {
  const actionColors = {
    buy: "text-[#2bfdab]", // green
    sell: "text-[#ff3d33]", // red
    airdrop: "text-[#8184f8]", // indigo
  };

  const actionText = {
    buy: "buy",
    sell: "sell",
    airdrop: "airdrop",
  };

  return (
    <div className="flex gap-4 items-center p-4 border-b border-neutral-900">
      {/* Avatar */}
      <div className="relative flex-shrink-0 w-10 h-10">
        <div className="absolute inset-0 w-10 h-10 rounded-lg overflow-hidden">
          <img
            src={trade.avatar}
            alt={trade.user}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Action Text */}
        <div className="flex items-center gap-[3px] text-[15px] leading-5">
          <span className="text-neutral-tertiary">{trade.user}</span>
          <span className={cn("font-normal", actionColors[trade.action])}>
            {actionText[trade.action]}
          </span>
          <span className="font-medium text-neutral-primary">
            {trade.targetUser}
          </span>
          <span className="text-neutral-tertiary">'s share</span>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          {/* Price and Time */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[13px] leading-4 text-primary text-right">
                {trade.price}
              </span>
              <div className="flex items-center">
                <ChainPair className="w-3 h-3" />
              </div>
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-tertiary opacity-40" />
            <span className="text-[13px] leading-4 text-neutral-tertiary">
              {trade.timestamp}
            </span>
          </div>

          {/* Tx Link */}
          <a
            href={trade.txLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-neutral-tertiary hover:text-neutral-primary transition-colors"
          >
            <span className="text-[13px] leading-4">Tx</span>
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 5L15 15M15 15V5M15 15H5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
