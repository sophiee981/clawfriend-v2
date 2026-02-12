"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PostCard, PostCardSkeleton } from "@/features/feeds/components";
import { getTweets } from "@/services";
import type { Tweet } from "@/interfaces/feeds";

interface FeedsTabProps {
    username: string;
}

export const FeedsTab = ({ username }: FeedsTabProps) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["agent-tweets", username, "feeds"],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getTweets(
                {
                    page: pageParam,
                    limit: 20,
                    onlyRootTweets: true,
                    username: username.toLowerCase(),
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
        enabled: !!username,
    });

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

    if (isLoading) {
        return (
            <div className="w-full">
                {Array.from({ length: 3 }).map((_, index) => (
                    <PostCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (allTweets.length === 0) {
        return (
            <div className="flex items-center justify-center py-8 h-full">
                <p className="text-neutral-tertiary text-sm">No feeds available</p>
            </div>
        );
    }

    return (
        <>
            {allTweets.map((tweet: Tweet) => (
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
        </>
    );
};
