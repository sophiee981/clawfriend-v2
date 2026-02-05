"use client";

import { ChainPair, ExternalLink } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import { Tabs } from "@/components/ui/tabs";
import { TrendItem } from "@/components/common/TrendItem";
import { TrendItemSkeleton } from "@/components/common/TrendItemSkeleton";
import { Empty } from "@/components/common/Empty";
import { AgentBalanceLeaderboard } from "@/interfaces/agent";
import { cn, getAvatarUrl } from "@/utils";
import { useState } from "react";

type ActivityAction = "bought" | "bid" | "sold" | "airdropped";

interface ActivityItem {
    id: string;
    actorName: string;
    subjectName: string;
    action: ActivityAction;
    amount: string;
    timestamp: string;
    transactionLink?: string;
}

type TabId = "just-tged" | "activities" | "trending";

interface ExploreMobileProps {
    agents?: AgentBalanceLeaderboard[];
    isLoading?: boolean;
}

const ExploreMobile = ({ agents = [], isLoading = false }: ExploreMobileProps = {}) => {
    const [activeTab, setActiveTab] = useState<TabId>("trending");

    // Mock data - replace with actual data from API
    const mockActivities: ActivityItem[] = [
        {
            id: "1",
            actorName: "Chairman",
            subjectName: "olimpio",
            action: "bought",
            amount: "0.0048",
            timestamp: "1d ago",
        },
        {
            id: "2",
            actorName: "Chairman",
            subjectName: "Small Cap",
            action: "bid",
            amount: "0.0048",
            timestamp: "1d ago",
        },
        {
            id: "3",
            actorName: "Yoh879",
            subjectName: "Chairman",
            action: "sold",
            amount: "0.0048",
            timestamp: "1d ago",
        },
        {
            id: "4",
            actorName: "TheHawk",
            subjectName: "Chairman",
            action: "airdropped",
            amount: "0.0048",
            timestamp: "1d ago",
        },
        {
            id: "5",
            actorName: "Adrian",
            subjectName: "Chark Beagle",
            action: "bought",
            amount: "0.0048",
            timestamp: "1d ago",
        },
        {
            id: "6",
            actorName: "Goat",
            subjectName: "Small Cap",
            action: "bid",
            amount: "0.0048",
            timestamp: "1d ago",
        },
        {
            id: "7",
            actorName: "Claud",
            subjectName: "olimpio",
            action: "sold",
            amount: "0.0048",
            timestamp: "1d ago",
        },
        {
            id: "8",
            actorName: "Claudecraft",
            subjectName: "Chairman",
            action: "airdropped",
            amount: "0.0048",
            timestamp: "1d ago",
        },
        {
            id: "9",
            actorName: "Kurt",
            subjectName: "Adrian",
            action: "bought",
            amount: "0.0048",
            timestamp: "1d ago",
        },
        {
            id: "10",
            actorName: "John",
            subjectName: "TheHawk",
            action: "bid",
            amount: "0.0048",
            timestamp: "1d ago",
        },
    ];

    const getActionColor = (action: ActivityAction): string => {
        switch (action) {
            case "bought":
                return "text-success";
            case "bid":
                return "text-info";
            case "sold":
                return "text-danger";
            case "airdropped":
                return "text-indigo";
            default:
                return "text-neutral-primary";
        }
    };


    const tabs: Array<{ id: TabId; label: string }> = [
        { id: "just-tged", label: "Just TGED" },
        { id: "activities", label: "Activities" },
        { id: "trending", label: "Trending" },
    ];

    return (
        <div className="flex h-full flex-col border-l border-neutral-01 pt-2 overflow-y-auto w-full">
            {/* Tabs */}
            <Tabs<TabId>
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                className="px-4"
                maxWidth="w-full"
            />

            <div className="flex w-full flex-col overflow-y-auto">
                {activeTab === "trending"
                    ? // Trending Tab
                    <div className="flex flex-col px-4 py-2 gap-2">
                        {isLoading ? (
                            <>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <TrendItemSkeleton key={i} />
                                ))}
                            </>
                        ) : agents.length > 0 ? (
                            agents.map((agent) => (
                                <TrendItem
                                    key={agent.agentId}
                                    agentId={agent.agentId}
                                    agentName={agent.agentName}
                                    agentUsername={agent.agentUsername}
                                    balance={agent.balance}
                                />
                            ))
                        ) : (
                            <Empty text="No trends found" />
                        )}
                    </div>
                    : activeTab === "activities"
                        ? // Activities Tab
                        mockActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex w-full gap-3 border-b border-neutral-900 p-4 transition-colors hover:bg-neutral-02"
                            >
                                {/* Avatars - Primary with Secondary Overlaid */}
                                <div className="relative shrink-0">
                                    <CompleteAvatar
                                        src={getAvatarUrl(activity.actorName)}
                                        name={activity.actorName}
                                        size="lg"
                                        className="h-10 w-10 border-0"
                                    />
                                    {/* Secondary Avatar Overlaid */}
                                    <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-neutral-900">
                                        <CompleteAvatar
                                            src={getAvatarUrl(activity.subjectName)}
                                            name={activity.subjectName}
                                            size="sm"
                                            className="h-4 w-4 border-0"
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                    {/* Top Row: Activity Description */}
                                    <div className="flex w-full items-center gap-1">
                                        <p className="text-body-sm text-neutral-primary">
                                            <span className="font-medium">{activity.actorName}</span>{" "}
                                            <span
                                                className={cn(
                                                    "font-medium",
                                                    getActionColor(activity.action)
                                                )}
                                            >
                                                {activity.action}
                                            </span>{" "}
                                            <span className="font-medium">
                                                {activity.subjectName}
                                            </span>
                                            's share
                                        </p>
                                    </div>

                                    {/* Bottom Row: Amount, Icon, Timestamp */}
                                    <div className="flex w-full items-center gap-1.5">
                                        <p className="text-body-xs text-primary">
                                            {activity.amount}
                                        </p>
                                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-neutral-primary">
                                            <ChainPair className="h-[12px] w-[12px]" />
                                        </div>
                                        <div className="h-1 w-1 shrink-0 rounded-full bg-neutral-500 opacity-40" />
                                        <p className="text-body-xs text-neutral-tertiary">
                                            {activity.timestamp}
                                        </p>
                                    </div>
                                </div>

                                {/* Transaction Link */}
                                <div className="flex shrink-0 items-center gap-1 text-body-xs text-neutral-tertiary">
                                    <span>Tx</span>
                                    <ExternalLink className="h-3 w-3" />
                                </div>
                            </div>
                        ))
                        : // Just TGED Tab (keep existing implementation)
                        mockActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex w-full gap-3 border-b border-neutral-900 p-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-colors hover:bg-neutral-02"
                            >
                                {/* Avatar */}
                                <div className="shrink-0">
                                    <CompleteAvatar
                                        src={getAvatarUrl(activity.actorName)}
                                        name={activity.actorName}
                                        size="lg"
                                        className="h-10 w-10 border-0"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                    {/* Top Row: Name and Amount */}
                                    <div className="flex w-full items-center gap-1">
                                        <p className="flex-1 truncate text-label-md text-neutral-primary">
                                            {activity.actorName}
                                        </p>
                                        <div className="flex shrink-0 items-center gap-1">
                                            <p className="text-body-xs text-primary">
                                                {activity.amount}
                                            </p>
                                            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-neutral-primary">
                                                <ChainPair className="h-[12px] w-[12px]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Username, Volume, Timestamp */}
                                    <div className="flex w-full items-center gap-2">
                                        <p className="max-w-[80px] truncate text-body-xs text-neutral-tertiary">
                                            @{activity.actorName.toLowerCase()}
                                        </p>
                                        <div className="h-1 w-1 shrink-0 rounded-full bg-neutral-500 opacity-40" />
                                        <p className="flex-1 truncate text-body-xs text-neutral-tertiary">
                                            <span className="text-neutral-primary">$12K</span>
                                            {" vol."}
                                        </p>
                                        <p className="shrink-0 text-body-xs text-neutral-tertiary">
                                            {activity.timestamp}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
            </div>
        </div>
    );
};

export default ExploreMobile;