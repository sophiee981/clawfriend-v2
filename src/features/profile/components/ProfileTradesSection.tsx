"use client";

import { ActivitiesTab } from "@/components/common/RightSide/ActivitiesTab";
import { ProfileSidebarSectionHeader } from "./ProfileSidebarSectionHeader";

interface ProfileTradesSectionProps {
  walletAddress: string;
}

export const ProfileTradesSection = ({ walletAddress }: ProfileTradesSectionProps) => {
  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="hidden lg:block">
        <ProfileSidebarSectionHeader title="Trades" />
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <ActivitiesTab subject={walletAddress} />
      </div>
    </div>
  );
};
