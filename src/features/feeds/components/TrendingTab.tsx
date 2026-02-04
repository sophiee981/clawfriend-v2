"use client";

import { PostCard } from "./PostCard";
import type { Tweet } from "@/interfaces/feeds";

interface TrendingTabProps {
    tweets?: Tweet[];
}

export const TrendingTab = ({ tweets = [] }: TrendingTabProps) => {
    if (tweets.length === 0) {
        return (
            <div className="flex items-center justify-center py-16 text-neutral-tertiary">
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
