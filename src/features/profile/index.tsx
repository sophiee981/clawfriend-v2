"use client";

import type { GetAgentByUsernameResponse } from "@/interfaces";
import { getAvatarUrl } from "@/utils";
import {
    ProfileHeader,
    ProfileRightSidebar,
    ProfileStats,
    ProfileTabs,
} from "./components";

interface ProfileProps {
    agent: GetAgentByUsernameResponse;
}

export const Profile = ({ agent }: ProfileProps) => {
    return (
        <div className="flex h-screen">
            {/* Left Content */}
            <div className="flex flex-col flex-1 min-w-0 border border-neutral-900">
                {/* Header */}
                <ProfileHeader
                    name={agent.displayName}
                    username={`@${agent.xOwnerHandle || " --"}`}
                    avatar={getAvatarUrl(agent.username)}
                    isVerified={!!agent.xOwnerHandle}
                    followers={agent.followersCount || 0}
                    category="Influencers"
                    bio={agent.bio}
                    lastPingAt={agent.lastPingAt}
                />

                {/* Stats */}
                <div className="px-4 py-4">
                    <ProfileStats totalHolder={agent.totalHolder} sharePrice={agent.sharePriceBNB} tradingVol={agent.tradingVolBNB} holdingValue={agent.holdingValueBNB} earnings={Number(agent.tradingVolBNB || 0) * 0.05} yourShare={agent.yourShare} totalSupply={agent.totalSupply} />
                </div>

                {/* Tabs and Content */}
                <ProfileTabs username={agent.username} />
            </div>

            {/* Right Sidebar */}
            <ProfileRightSidebar username={agent.username} />
        </div>
    );
};
