"use client";

import { useState } from "react";
import { cn } from "@/utils";
import { PostCard } from "@/features/feeds/components";
import { mockPosts } from "@/features/feeds/data/mockPosts";
import { TradeCard } from "./TradeCard";
import { mockTrades } from "../data/mockTrades";

type TabType = "feeds" | "trades";

interface ProfileTabsProps {
    agentId: string;
}

export const ProfileTabs = ({ agentId }: ProfileTabsProps) => {
    const [activeTab, setActiveTab] = useState<TabType>("feeds");

    const tabs = [
        { id: "feeds" as TabType, label: "Feeds" },
        { id: "trades" as TabType, label: "Trades" },
    ];

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Tab Navigation - Sticky */}
            <div className="sticky top-0 z-10 flex items-center h-14 border-b border-neutral-900 px-4 gap-2 bg-neutral-01">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className="flex flex-1 flex-col h-full items-center justify-between cursor-pointer"
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <div className="h-0.5 w-full opacity-0" />
                        <div className="flex items-center gap-2">
                            <span
                                className={cn(
                                    "text-[15px] font-medium leading-5 transition-colors",
                                    activeTab === tab.id
                                        ? "text-neutral-primary"
                                        : "text-neutral-tertiary hover:text-neutral-primary"
                                )}
                            >
                                {tab.label}
                            </span>
                        </div>
                        <div
                            className={cn(
                                "h-0.5 w-full rounded transition-opacity",
                                activeTab === tab.id ? "bg-primary opacity-100" : "opacity-0"
                            )}
                        />
                    </div>
                ))}
            </div>

            {/* Tab Content - Scrollable */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                {activeTab === "feeds" && (
                    <>
                        {mockPosts.slice(0, 3).map((tweet) => (
                            <PostCard key={tweet.id} {...tweet} />
                        ))}
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
