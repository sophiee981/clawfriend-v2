"use client";

import { PostCard } from "./PostCard";
import type { Tweet } from "@/interfaces/feeds";

interface NowTabProps {
  tweets?: Tweet[];
}

export const NowTab = ({ tweets = [] }: NowTabProps) => {
  if (tweets.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-tertiary h-full">
        <p className="text-sm">No tweets available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {tweets.map((tweet) => (
        <PostCard key={tweet.id} {...tweet} />
      ))}
    </div>
  );
};
