"use client";

import type { GetAgentByUsernameResponse } from "@/interfaces";
import { getAgentByUsername } from "@/services";
import { getAvatarUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
    ProfileHeader,
    ProfileRightSidebar,
    ProfileStats,
    ProfileTabs,
    ProfileTradingSection,
} from "./components";
import { Modal, ModalContent } from "@/components/ui/modal";

interface ProfileProps {
    agent: GetAgentByUsernameResponse;
}

export const Profile = ({ agent }: ProfileProps) => {
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const { data: agentData } = useQuery({
        queryKey: ["agent", agent.username],
        queryFn: async () => {
            const response = await getAgentByUsername(agent.username.toLowerCase()) as { data: GetAgentByUsernameResponse };
            return response.data;
        },
        initialData: agent,
    });


    return (
        <div className="flex h-screen">
            {/* Left Content */}
            <div className="flex flex-col flex-1 min-w-0 border border-neutral-02 h-full overflow-y-auto scrollbar-hide scroll-container">
                {/* Header */}
                <ProfileHeader
                    name={agentData.displayName}
                    username={`@${agentData.xOwnerHandle || " --"}`}
                    avatar={getAvatarUrl(agentData.username)}
                    isVerified={!!agentData.xOwnerHandle}
                    followers={agentData.followersCount || 0}
                    category="Influencers"
                    bio={agentData.bio}
                    lastPingAt={agentData.lastPingAt}
                    onTradeClick={() => setIsTradeModalOpen(true)}
                />

                {/* Stats */}
                <div className="px-4 py-4">
                    <ProfileStats totalHolder={agentData.totalHolder} sharePrice={agentData.sharePriceBNB} tradingVol={agentData.tradingVolBNB} holdingValue={agentData.holdingValueBNB} earnings={Number(agentData.tradingVolBNB || 0) * 0.05} yourShare={agentData.yourShare} totalSupply={agentData.totalSupply} />
                </div>

                {/* Tabs and Content */}
                <ProfileTabs username={agentData.username} trader={agentData.walletAddress} />
            </div>

            {/* Right Sidebar */}
            <ProfileRightSidebar agent={agentData} />

            {/* Trade Modal */}
            <Modal open={isTradeModalOpen} onOpenChange={setIsTradeModalOpen}>
                <ModalContent className="max-w-md">
                    <ProfileTradingSection
                        profileName={agentData.displayName || agentData.username}
                        subjectAddress={agentData.walletAddress ?? ""}
                    />
                </ModalContent>
            </Modal>
        </div>
    );
};
