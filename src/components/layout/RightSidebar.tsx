"use client";

import { cn } from "@/utils";
import Link from "next/link";

type ActivityType = "bought" | "sold" | "bid" | "airdropped";

interface Activity {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: ActivityType;
  target: string;
  value: string;
  time: string;
  txLink: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    user: { name: "Chairman", avatar: "https://avatar.vercel.sh/chairman" },
    action: "bought",
    target: "olimpio's share",
    value: "0.0048",
    time: "1d",
    txLink: "#",
  },
  {
    id: "2",
    user: { name: "Chairman", avatar: "https://avatar.vercel.sh/chairman" },
    action: "bid",
    target: "Small Cap's share",
    value: "0.0048",
    time: "1d",
    txLink: "#",
  },
  {
    id: "3",
    user: { name: "Chairman", avatar: "https://avatar.vercel.sh/chairman" },
    action: "sold",
    target: "Chark Beagle's share",
    value: "0.0048",
    time: "1d",
    txLink: "#",
  },
  {
    id: "4",
    user: { name: "Chairman", avatar: "https://avatar.vercel.sh/chairman" },
    action: "bought",
    target: "Andrea Brekken's share",
    value: "0.0048",
    time: "1d",
    txLink: "#",
  },
  {
    id: "5",
    user: { name: "Chairman", avatar: "https://avatar.vercel.sh/chairman" },
    action: "bought",
    target: "Andrea Brekken's share",
    value: "0.0048",
    time: "1d",
    txLink: "#",
  },
  {
    id: "6",
    user: { name: "Adrian", avatar: "https://avatar.vercel.sh/adrian" },
    action: "bought",
    target: "Chairman's share",
    value: "0.0048",
    time: "1d",
    txLink: "#",
  },
  {
    id: "7",
    user: { name: "Grace Baseme", avatar: "https://avatar.vercel.sh/grace" },
    action: "bought",
    target: "Chairman's share",
    value: "0.0048",
    time: "1d",
    txLink: "#",
  },
  {
    id: "8",
    user: { name: "Yoh879", avatar: "https://avatar.vercel.sh/yoh" },
    action: "sold",
    target: "Chairman's share",
    value: "0.0048",
    time: "1d",
    txLink: "#",
  },
  {
    id: "9",
    user: { name: "Yoh879", avatar: "https://avatar.vercel.sh/yoh" },
    action: "sold",
    target: "Chairman's share",
    value: "0.0048",
    time: "1d",
    txLink: "#",
  },
  {
    id: "10",
    user: { name: "TheHawk", avatar: "https://avatar.vercel.sh/hawk" },
    action: "airdropped",
    target: "Chairman's share",
    value: "0.0048",
    time: "1d",
    txLink: "#",
  },
];

export const RightSidebar = () => {
  return (
    <aside className="sticky top-0 hidden h-screen w-[320px] lg:flex flex-col border-l border-neutral-01 bg-neutral-01">
      <div className="flex items-center justify-center border-b border-neutral-01 py-4">
        <h2 className="text-base font-bold text-neutral-secondary">
          Activities
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-neutral-03 scrollbar-track-transparent">
        <div className="flex flex-col gap-6">
          {MOCK_ACTIVITIES.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </aside>
  );
};

const ActivityItem = ({ activity }: { activity: Activity }) => {
  const getActionColor = (type: ActivityType) => {
    switch (type) {
      case "bought":
        return "text-text-success"; // Green
      case "sold":
        return "text-text-danger"; // Red
      case "bid":
        return "text-text-info"; // Blue
      case "airdropped":
        return "text-text-indigo"; // Purple/Indigo
      default:
        return "text-white";
    }
  };

  return (
    <div className="flex gap-3 text-sm">
      <div className="relative h-8 w-8 flex-shrink-0">
        <img
          src={activity.user.avatar}
          className="h-8 w-8 rounded-full bg-neutral-02 object-cover"
          alt={activity.user.name}
        />
        {/* Small icon overlay for action type could go here if design needed it */}
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <div className="text-neutral-300 leading-snug">
          <span className="font-bold text-white">{activity.user.name}</span>{" "}
          <span className={cn("font-medium", getActionColor(activity.action))}>
            {activity.action}
          </span>{" "}
          <span className="text-neutral-tertiary">{activity.target}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-tertiary">
          <span className="flex items-center gap-1 text-text-lime font-mono">
            <div className="h-1.5 w-1.5 rounded-full bg-lime-500"></div>
            {activity.value}
          </span>
          <span>•</span>
          <span>{activity.time}</span>
          <Link
            href={activity.txLink}
            className="ml-auto flex items-center gap-0.5 text-neutral-tertiary hover:text-white transition-colors"
          >
            Tx
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
