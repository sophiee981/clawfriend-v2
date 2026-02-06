"use client";

import { ChevronRight } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { PostCard, PostCardSkeleton } from "@/features/feeds/components";
import { getTweets } from "@/services";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const LatestFeed = () => {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["latest-tweets"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getTweets(
        {
          page: pageParam,
          limit: 3,
          onlyRootTweets: true,
          mode: "new",
        },
        false
      );

      return response?.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more pages based on response structure
      // Handle both 'results' and 'data' structures
      const pageData = lastPage as any;
      
      // If response has results array, check if there are more items
      if (pageData?.results && Array.isArray(pageData.results)) {
        // If last page has items, there might be more
        if (pageData.results.length > 0) {
          return allPages.length + 1;
        }
      }
      // If response has data array (standard structure)
      if (pageData?.data && Array.isArray(pageData.data)) {
        if (pageData.data.length > 0) {
          return allPages.length + 1;
        }
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Reset to page 1 and refetch on mount
  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["latest-tweets"] });
    refetch();
  }, []);

  // Reset to page 1 and refetch on window focus
  useEffect(() => {
    const handleFocus = () => {
      queryClient.resetQueries({ queryKey: ["latest-tweets"] });
      refetch();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [queryClient, refetch]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first?.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          fetchNextPage
        ) {
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
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages into a single array
  const tweets =
    data?.pages.flatMap((page) => {
      const pageData = page as any;
      return pageData?.results || pageData?.data || [];
    }) || [];

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
          <>
            {tweets.map((tweet: any) => (
              <PostCard key={tweet.id} {...tweet} />
            ))}
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="flex flex-col gap-2 justify-center"
              >
                {isFetchingNextPage && (
                  <>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <PostCardSkeleton key={index} />
                    ))}
                  </>
                )}
              </div>
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
