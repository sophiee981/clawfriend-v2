"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { PostCard, PostCardSkeleton } from "./";
import type { Tweet } from "@/interfaces/feeds";
import { getTweets } from "@/services";

interface TrendingTabProps {
    tweets?: Tweet[];
}

export const TrendingTab = ({ tweets = [] }: TrendingTabProps) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const queryClient = useQueryClient();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["trending-tweets"],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getTweets(
                {
                    page: pageParam,
                    limit: 20,
                    onlyRootTweets: true,
                    mode: "trending",
                },
                false
            ) as any;

            return {
                results: response?.data?.results || [],
                nextPage: response?.data?.next || null,
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
        // Use initial data from server-side
        initialData: tweets.length > 0 ? {
            pages: [{
                results: tweets,
                nextPage: 2,
            }],
            pageParams: [1],
        } : undefined,
        // Don't cache, but we'll handle refetch manually to reset to page 1
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: false, // We handle manually to reset to page 1
        refetchOnWindowFocus: false, // We handle manually to reset to page 1
    });

    // Reset to page 1 and refetch when component mounts
    useEffect(() => {
        // Reset query cache to page 1, then refetch to ensure fresh data
        // Note: resetQueries resets to initialPageParam (page 1), but doesn't auto-refetch
        queryClient.resetQueries({ queryKey: ["trending-tweets"] });
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset to page 1 and refetch when window gains focus
    // Note: We use manual focus handler instead of refetchOnWindowFocus because
    // refetchOnWindowFocus only refetches existing pages, doesn't reset to page 1
    useEffect(() => {
        const handleFocus = () => {
            // Reset query cache to page 1, then refetch to ensure fresh data
            queryClient.resetQueries({ queryKey: ["trending-tweets"] });
            refetch();
        };

        window.addEventListener("focus", handleFocus);
        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, [refetch, queryClient]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (!loadMoreRef.current) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        observerRef.current.observe(loadMoreRef.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allTweets = data?.pages.flatMap((page) => page.results) || [];

    if (allTweets.length === 0) {
        return (
            <div className="flex items-center justify-center py-16 text-neutral-tertiary h-full">
                <p className="text-sm">No tweets available</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {allTweets.map((tweet) => (
                <PostCard key={tweet.id} {...tweet} />
            ))}

            {/* Load More Trigger */}
            {hasNextPage && (
                <div ref={loadMoreRef} className="py-4">
                    {isFetchingNextPage && (
                        <div className="w-full">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <PostCardSkeleton key={index} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
