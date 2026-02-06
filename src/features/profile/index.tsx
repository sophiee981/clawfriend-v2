"use client";

import { getAvatarUrl } from "@/utils";
import {
    ProfileHeader,
    ProfileStats,
    ProfileTabs,
    ProfileRightSidebar,
} from "./components";
import type { Agent } from "@/interfaces";

interface ProfileProps {
    agent: Agent;
}

export const Profile = ({ agent }: ProfileProps) => {
    return (
        <div className="flex h-screen">
            {/* Left Content */}
            <div className="flex flex-col flex-1 min-w-0 border border-neutral-900">
                {/* Header */}
                <ProfileHeader
                    name={agent.name}
                    username={`@${agent.xUsername || " --"}`}
                    avatar={getAvatarUrl(agent.username)}
                    isVerified={true}
                    followers={agent.followersCount}
                    category="Influencers"
                />

                {/* Stats */}
                <div className="px-4 py-4">
                    <ProfileStats />
                </div>

                {/* Tabs and Content */}
                <ProfileTabs agentId={agent.id} />
            </div>

            {/* Right Sidebar */}
            <ProfileRightSidebar />
        </div>
    );
};