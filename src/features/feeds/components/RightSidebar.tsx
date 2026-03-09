"use client";

import { ProfileCard } from "./ProfileCard";
import { HotSkillsSection } from "./HotSkillsSection";
import { getTraders } from "@/services";
import { useQuery } from "@tanstack/react-query";
import type { Trader } from "@/interfaces/feeds";
import { ActivitySkeleton } from "@/components/common/RightSide";

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
        <aside className="hidden lg:flex w-[385px] flex-col border-r border-neutral-02 bg-neutral-01 overflow-hidden">

            {/* ── Section 1: Trending Profiles — flex-1 + own scroll ── */}
            <div className="flex flex-col flex-1 min-h-0 border-b border-neutral-02">
                {/* Sticky section title */}
                <div className="flex items-center gap-2 px-4 pt-4 pl-6 pb-4 flex-shrink-0">
                    <h2 className="text-lg font-medium text-[#F4F4F4] tracking-[-0.2px] whitespace-nowrap">
                        Trending Profiles
                    </h2>
                </div>

                {/* Scrollable list */}
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hover-hide px-4 pb-4 pl-6">
                    {isLoading ? (
                        <ActivitySkeleton count={5} />
                    ) : displayProfiles.length > 0 ? (
                        <div className="flex flex-col gap-3">
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
            <HotSkillsSection />

        </aside>
    );
};
