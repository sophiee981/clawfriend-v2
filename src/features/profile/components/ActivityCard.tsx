"use client";

import { ChainPair } from "@/components/icons";
import { cn } from "@/utils";

type ActivityAction = "bought" | "bid" | "sold";

interface Activity {
  id: string;
  user: string;
  targetUser: string;
  avatar: string;
  action: ActivityAction;
  price: string;
  timestamp: string;
  txLink: string;
}

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const actionColors: Record<ActivityAction, string> = {
    bought: "text-[#2bfdab]", // green
    bid: "text-[#0a84ff]", // blue
    sold: "text-[#ff3d33]", // red
  };

  const actionText: Record<ActivityAction, string> = {
    bought: "bought",
    bid: "bid",
    sold: "sold",
  };

  return (
    <div className="flex gap-4 items-center p-4 border-b border-neutral-900">
      {/* Avatar */}
      <div className="relative flex-shrink-0 w-10 h-10">
        <div className="absolute inset-0 w-10 h-10 rounded-lg overflow-hidden">
          <img
            src={activity.avatar}
            alt={activity.targetUser}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Action Text */}
        <div className="flex items-center gap-[3px] text-[15px] leading-5">
          <span className="text-neutral-tertiary">{activity.user}</span>
          <span className={cn("font-normal", actionColors[activity.action])}>
            {actionText[activity.action]}
          </span>
          <span className="font-medium text-neutral-primary">
            {activity.targetUser}
          </span>
          <span className="text-neutral-tertiary">'s share</span>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          {/* Price and Time */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[13px] leading-4 text-primary text-right">
                {activity.price}
              </span>
              <div className="flex items-center">
                <ChainPair className="w-3 h-3" />
              </div>
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-tertiary opacity-40" />
            <span className="text-[13px] leading-4 text-neutral-tertiary">
              {activity.timestamp}
            </span>
          </div>

          {/* Tx Link */}
          <a
            href={activity.txLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-neutral-tertiary hover:text-neutral-primary transition-colors"
          >
            <span className="text-[13px] leading-4">Tx</span>
            <svg
              className="w-4 h-4 -rotate-90"
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
