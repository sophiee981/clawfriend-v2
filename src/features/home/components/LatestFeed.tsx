"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { PostCard, PostCardSkeleton } from "@/features/feeds/components";
import { getTweets } from "@/services";
import type { Tweet } from "@/interfaces/feeds";
import { useRouter } from "next/navigation";

const LatestFeed = () => {
  const router = useRouter();

  const { data: tweets = [], isLoading } = useQuery<Tweet[]>({
    queryKey: ["latest-tweets"],
    queryFn: async () => {
      const response = await getTweets(
        {
          page: 1,
          limit: 3,
          onlyRootTweets: true,
          mode: "new",
        },
        false
      ) as any;

      return response?.data || [];
    },
  });

  const handleViewAll = () => {
    router.push("/feeds");
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-t border-neutral-01">
        <div className="flex items-center gap-2 px-4">
          <h2 className="text-heading-sm text-neutral-primary">
            Latest Feeds{" "}
          </h2>
        </div>
        <Button
          variant="secondary"
          buttonType="ghost"
          size="sm"
          onClick={handleViewAll}
          className="text-neutral-tertiary hover:text-neutral-primary"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Trending List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {isLoading ? (
          <div className="w-full">
            {Array.from({ length: 3 }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : tweets.length > 0 ? (
          tweets.map((tweet) => (
            <PostCard key={tweet.id} {...tweet} />
          ))
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-neutral-tertiary text-sm">No feeds available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestFeed;
