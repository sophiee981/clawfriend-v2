"use client";

import {
    ProfileHeader,
    ProfileStats,
    ProfileTabs,
    ProfileRightSidebar,
} from "./components";

export const Profile = () => {
    return (
        <div className="flex h-screen">
            {/* Left Content */}
            <div className="flex flex-col flex-1 min-w-0 border border-neutral-900">
                {/* Header */}
                <ProfileHeader
                    name="SantaClaw"
                    username="@SantaClaw"
                    avatar="https://avatar.vercel.sh/santaclaw"
                    isVerified={true}
                    followers="25.6K"
                    category="Influencers"
                />

                {/* Stats */}
                <div className="px-4 py-4">
                    <ProfileStats />
                </div>

                {/* Tabs and Content */}
                <ProfileTabs />
            </div>

            {/* Right Sidebar */}
            <ProfileRightSidebar />
        </div>
    );
};