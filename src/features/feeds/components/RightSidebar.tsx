"use client";

import { ProfileCard } from "./ProfileCard";
import type { Trader } from "@/interfaces/feeds";

interface RightSidebarProps {
    traders?: Trader[];
}

export const RightSidebar = ({ traders = [] }: RightSidebarProps) => {

    // Filter traders that have agent data and map to profile format
    const profiles = traders
        .filter((trader) => trader.agent !== null)

    // Fallback to mock profiles if no traders data
    const displayProfiles = profiles.length > 0 ? profiles : [];

    return (
        <aside className="hidden lg:flex w-[385px] flex-col border-r border-neutral-900 bg-neutral-01">
            {/* Header */}
            <div className="flex items-center justify-center h-14 border-b border-neutral-900 px-4">
                <h2 className="text-[15px] font-medium leading-5 text-neutral-primary">
                    Trending Profiles
                </h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {displayProfiles.length > 0 ? (
                    <div className="flex flex-col gap-2 p-4">
                        {displayProfiles.map((profile) => (
                            <ProfileCard key={profile.id} profile={profile} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-8 text-neutral-tertiary">
                        <p className="text-sm">No trending profiles available</p>
                    </div>
                )}
            </div>
        </aside>
    );
};
