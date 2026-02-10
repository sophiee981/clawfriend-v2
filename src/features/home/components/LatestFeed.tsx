"use client";

import { ChevronRight } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { PostCard, PostCardSkeleton } from "@/features/feeds/components";
import { getTweets } from "@/services";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "@bprogress/next/app";
import { useEffect, useRef } from "react";

const LatestFeed = () => {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const LIMIT = 10;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["latest-tweets"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getTweets(
        {
          page: pageParam,
          limit: LIMIT,
          onlyRootTweets: true,
          mode: "new",
        },
        false
      );

      return response?.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const pageData = lastPage as any;
      let itemsLength = 0;

      // Handle both 'results' and 'data' structures
      if (pageData?.results && Array.isArray(pageData.results)) {
        itemsLength = pageData.results.length;
      } else if (pageData?.data && Array.isArray(pageData.data)) {
        itemsLength = pageData.data.length;
      }

      // Only fetch next page if current page has full limit of items
      // If less than limit, it means we've reached the end
      if (itemsLength === LIMIT) {
        return allPages.length + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
    refetchOnMount: true,
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    // Don't set up observer if there's no next page or already fetching
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        // Double check conditions before fetching
        if (first?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages into a single array and remove duplicates by ID
  const tweets =
    data?.pages.flatMap((page) => {
      const pageData = page as any;
      return pageData?.results || pageData?.data || [];
    }) || [];

  // Remove duplicate tweets by ID to prevent duplicate keys
  const uniqueTweets = tweets.filter(
    (tweet: any, index: number, self: any[]) =>
      index === self.findIndex((t) => t.id === tweet.id)
  );

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
            {Array.from({ length: 5 }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : uniqueTweets.length > 0 ? (
          <>
            {uniqueTweets.map((tweet: any) => (
              <PostCard key={tweet.id} {...tweet} />
            ))}

            {/* Load more trigger */}
            {hasNextPage && (
              <>
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <PostCardSkeleton key={`loading-${index}`} />
                  ))}
                </div>
                <div ref={loadMoreRef} className="h-4" />
              </>
            )}
          </>
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
