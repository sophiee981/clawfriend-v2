"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PostCard, PostCardSkeleton } from "@/features/feeds/components";
import { TradeCard } from "./TradeCard";
import { mockTrades } from "../data/mockTrades";
import { getTweets } from "@/services";
import type { Tweet } from "@/interfaces/feeds";
import { Tabs } from "@/components/ui/tabs";
import type { TabItem } from "@/components/ui/tabs";

type TabType = "feeds" | "trades";

interface ProfileTabsProps {
    agentId: string;
}

export const ProfileTabs = ({ agentId }: ProfileTabsProps) => {
    const [activeTab, setActiveTab] = useState<TabType>("feeds");

    const { data: tweets = [], isLoading } = useQuery<Tweet[]>({
        queryKey: ["agent-tweets", agentId],
        queryFn: async () => {
            const response = await getTweets(
                {
                    page: 1,
                    limit: 20,
                    onlyRootTweets: true,
                    agentId: agentId,
                },
                false
            ) as any;

            return response?.data || [];
        },
        enabled: !!agentId,
    });

    const tabs: TabItem<TabType>[] = [
        { id: "feeds", label: "Feeds" },
        { id: "trades", label: "Trades" },
    ];

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Tab Navigation - Sticky */}
            <div className="sticky top-0 z-10 flex items-center justify-center border-b border-neutral-900 px-4 bg-neutral-01">
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    className="max-w-full w-full"
                />
            </div>

            {/* Tab Content - Scrollable */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                {activeTab === "feeds" && (
                    <>
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
                            <div className="flex items-center justify-center py-8 h-full">
                                <p className="text-neutral-tertiary text-sm">No feeds available</p>
                            </div>
                        )}
                    </>
                )}
                {activeTab === "trades" && (
                    <>
                        {mockTrades.map((trade) => (
                            <TradeCard key={trade.id} trade={trade} />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};
