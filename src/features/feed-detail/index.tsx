"use client";

import { PostCardSkeleton, RightSidebar } from "@/features/feeds/components";
import type { Tweet } from "@/interfaces/feeds";
import { getTweetReplies } from "@/services/feeds.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { FeedDetailHeader, MainPostCard, ReplyCard } from "./components";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { ScrollButton } from "@/components/common/ScrollButton";

interface FeedDetailProps {
    tweetId: string;
    initialTweet: Tweet;
}

export const FeedDetail = ({
    tweetId,
    initialTweet,
}: FeedDetailProps) => {
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Use scroll to top hook
    const { showScrollTop, scrollToTop } = useScrollToTop({
        containerSelector: '.scroll-container',
        threshold: 300,
        behavior: "smooth",
    });

    // Fetch replies with infinite scroll
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["tweet-replies", tweetId],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getTweetReplies(
                tweetId,
                {
                    page: pageParam,
                    limit: 20,
                },
                false
            ) as any;
            return response;
        },
        getNextPageParam: (lastPage) => {
            // Use the 'next' field from response to determine if there's more data
            const nextPage = lastPage?.data?.next;
            return nextPage ? nextPage : undefined;
        },
        initialPageParam: 1,
    });

    // Flatten all pages into a single array of replies
    const replies = data?.pages.flatMap((page) =>
        page?.data?.results && Array.isArray(page.data.results) ? page.data.results : []
    ) || [];

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (
                    first?.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
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

    return (
        <div className="flex h-screen">
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 border-x border-neutral-02 relative">
                {/* Header */}
                <FeedDetailHeader />

                {/* Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide scroll-container">
                    {/* Main Post */}
                    <MainPostCard tweet={initialTweet} />

                    {/* Initial loading state */}
                    {isLoading && (
                        <div className="w-full">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <PostCardSkeleton key={index} />
                            ))}
                        </div>
                    )}

                    {/* Replies Section */}
                    {!isLoading && replies.length > 0 && (
                        <div className="border-b border-neutral-800">
                            {replies.map((reply: Tweet) => (
                                <div
                                    key={reply.id}
                                    className="border-b border-neutral-800 last:border-b-0"
                                >
                                    <ReplyCard tweet={reply} />
                                </div>
                            ))}
                        </div>
                    )}

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

                    {/* Empty state */}
                    {!isLoading && replies.length === 0 && (
                        <div className="flex items-center justify-center py-16 text-neutral-tertiary">
                            <p className="text-sm">No replies yet</p>
                        </div>
                    )}
                </div>

                {/* Scroll to Top Button */}
                {showScrollTop && (
                    <div className="sm:flex hidden sticky bottom-5 justify-center z-50 pointer-events-none">
                        <ScrollButton scrollToTop={scrollToTop} />
                    </div>
                )}
            </div>

            {/* Right Sidebar */}
            <RightSidebar />
        </div>
    );
};
