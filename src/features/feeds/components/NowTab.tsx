"use client";

import { useQuery } from "@tanstack/react-query";
import { PostCard, PostCardSkeleton } from "./";
import type { Tweet } from "@/interfaces/feeds";
import { getTweets } from "@/services";

export const NowTab = () => {
  const { data: tweets = [], isLoading } = useQuery<Tweet[]>({
    queryKey: ["now-tweets"],
    queryFn: async () => {
      const response = await getTweets(
        {
          page: 1,
          limit: 20,
          onlyRootTweets: true,
          mode: "new",
        },
        false
      ) as any;

      return response?.data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="w-full">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

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
