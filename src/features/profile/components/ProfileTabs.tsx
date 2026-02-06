"use client";

import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PostCard, PostCardSkeleton } from "@/features/feeds/components";
import { TradeCard } from "./TradeCard";
import { getTweets } from "@/services";
import type { Tweet } from "@/interfaces/feeds";
import { Tabs } from "@/components/ui/tabs";
import type { TabItem } from "@/components/ui/tabs";

type TabType = "feeds" | "trades";

interface ProfileTabsProps {
    username: string;
}

export const ProfileTabs = ({ username }: ProfileTabsProps) => {
    const [activeTab, setActiveTab] = useState<TabType>("feeds");
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["agent-tweets", username],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getTweets(
                {
                    page: pageParam,
                    limit: 20,
                    onlyRootTweets: true,
                    username: username,
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
        if (activeTab !== "feeds" || !loadMoreRef.current) return;

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
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, activeTab]);

    const allTweets = data?.pages.flatMap((page) => page.results) || [];

    const tabs: TabItem<TabType>[] = [
        { id: "feeds", label: "Feeds" },
        { id: "trades", label: "Trades" },
    ];

    const handleTabChange = (tabId: TabType) => {
        setActiveTab(tabId);
        // Scroll to top when tab changes
        if (contentRef.current) {
            contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Tab Navigation - Sticky */}
            <div className="flex items-center border-t h-14 border-b border-neutral-900 px-4">
                <h2 className="text-[15px] font-medium leading-5 text-neutral-primary">
                    Feeds
                </h2>
            </div>

            {/* Tab Content - Scrollable */}
            <div
                ref={contentRef}
                className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide"
            >
                {activeTab === "feeds" && (
                    <>
                        {isLoading ? (
                            <div className="w-full">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <PostCardSkeleton key={index} />
                                ))}
                            </div>
                        ) : allTweets.length > 0 ? (
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
                        ) : (
                            <div className="flex items-center justify-center py-8 h-full">
                                <p className="text-neutral-tertiary text-sm">No feeds available</p>
                            </div>
                        )}
                    </>
                )}
                {/* {activeTab === "trades" && (
                    <>
                        {mockTrades.map((trade) => (
                            <TradeCard key={trade.id} trade={trade} />
                        ))}
                    </>
                )} */}
            </div>
        </div>
    );
};
