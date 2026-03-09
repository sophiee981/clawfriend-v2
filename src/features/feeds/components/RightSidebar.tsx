"use client";

import { ProfileCard } from "./ProfileCard";
import { HotSkillCard, type HotSkill } from "./HotSkillCard";
import { getTraders } from "@/services";
import { useQuery } from "@tanstack/react-query";
import type { Trader } from "@/interfaces/feeds";
import { ActivitySkeleton } from "@/components/common/RightSide";

// Mock data for Hot Skills — replace with API when available
const MOCK_HOT_SKILLS: HotSkill[] = [
    {
        id: "1",
        name: "Wallet Balance Checker",
        authorName: "Base Agents",
        authorUsername: "baseagents",
        stars: 5000,
    },
    {
        id: "2",
        name: "Token Price Alert",
        authorName: "DeFi Tools",
        authorUsername: "defitools",
        stars: 1200,
    },
    {
        id: "3",
        name: "Portfolio Tracker",
        authorName: "Base Agents",
        authorUsername: "baseagents",
        stars: 5000,
    },
    {
        id: "4",
        name: "Gas Fee Monitor",
        authorName: "ETH Builders",
        authorUsername: "ethbuilders",
        stars: 3500,
    },
    {
        id: "5",
        name: "NFT Floor Price Tracker",
        authorName: "NFT Labs",
        authorUsername: "nftlabs",
        stars: 890,
    },
];

export const RightSidebar = () => {
    const { data: tradersResponse, isLoading } = useQuery({
        queryKey: ["traders", "feeds-sidebar"],
        queryFn: async () => {
            const response = await getTraders(
                {
                    page: 1,
                    limit: 20,
                },
                false
            );
            return response as any;
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const traders: Trader[] = tradersResponse?.data?.data || [];
    const profiles = traders.filter((trader) => trader.agent !== null);
    const displayProfiles = profiles.length > 0 ? profiles : [];

    return (
        <aside className="hidden lg:flex w-[385px] flex-col border-r border-neutral-900 bg-neutral-01 overflow-hidden">

            {/* ── Section 1: Trending Profiles — flex-1 + own scroll ── */}
            <div className="flex flex-col flex-1 min-h-0 border-b border-neutral-900">
                {/* Sticky section title */}
                <div className="flex items-center gap-2 px-4 pt-4 pb-4 flex-shrink-0">
                    <h2 className="text-lg font-medium text-[#F4F4F4] tracking-[-0.2px] whitespace-nowrap">
                        Trending Profiles
                    </h2>
                </div>

                {/* Scrollable list */}
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hover-hide px-4 pb-4">
                    {isLoading ? (
                        <ActivitySkeleton count={5} />
                    ) : displayProfiles.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {displayProfiles.map((profile) => (
                                <ProfileCard key={profile.id} profile={profile} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-8 text-neutral-tertiary">
                            <p className="text-sm">No trending profiles available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Section 2: Hot Skills — flex-1 + own scroll ── */}
            <div className="flex flex-col flex-1 min-h-0">
                {/* Sticky section title */}
                <div className="flex items-center gap-2 px-4 pt-4 pb-4 flex-shrink-0">
                    <h2 className="text-lg font-medium text-[#F4F4F4] tracking-[-0.2px] whitespace-nowrap">
                        Hot Skills
                    </h2>
                </div>

                {/* Scrollable list */}
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hover-hide px-4 pb-4">
                    <div className="flex flex-col gap-2">
                        {MOCK_HOT_SKILLS.map((skill) => (
                            <HotSkillCard key={skill.id} skill={skill} />
                        ))}
                    </div>
                </div>
            </div>

        </aside>
    );
};
