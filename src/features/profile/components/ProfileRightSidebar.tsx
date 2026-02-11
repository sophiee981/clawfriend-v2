"use client";

import { GetAgentByUsernameResponse } from "@/interfaces";
import { ProfileTradesSection } from "./ProfileTradesSection";
import { ProfileTradingSection } from "./ProfileTradingSection";

interface ProfileRightSidebarProps {
  agent: GetAgentByUsernameResponse;
}

export const ProfileRightSidebar = ({ agent }: ProfileRightSidebarProps) => {
  return (
    <aside className="hidden lg:flex w-[385px] flex-col border-r border-neutral-03 bg-neutral-01">
      <ProfileTradingSection
        profileName={agent.displayName || agent.username}
        subjectAddress={agent.walletAddress ?? ""}
      />
      <ProfileTradesSection walletAddress={agent.walletAddress} />
    </aside>
  );
};
