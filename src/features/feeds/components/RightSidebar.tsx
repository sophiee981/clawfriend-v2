"use client";

import { ProfileCard } from "./ProfileCard";
import { mockProfiles } from "../data/mockProfiles";

export const RightSidebar = () => {
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
                <div className="flex flex-col gap-2 p-4">
                    {mockProfiles.map((profile) => (
                        <ProfileCard key={profile.id} profile={profile} />
                    ))}
                </div>
            </div>
        </aside>
    );
};
