"use client";

import { ActivitiesTab } from "@/components/common/RightSide/ActivitiesTab";

interface ProfileRightSidebarProps {
  username: string;
}

export const ProfileRightSidebar = ({ username }: ProfileRightSidebarProps) => {
  return (
    <aside className="hidden lg:flex w-[385px] flex-col border-r border-neutral-900 bg-neutral-01">
      {/* Header */}
      <div className="flex items-center justify-center h-14 border-b border-neutral-900 px-4">
        <h2 className="text-[15px] font-medium leading-5 text-neutral-primary">
          Trades
        </h2>
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <ActivitiesTab username={username} />
      </div>
    </aside>
  );
};
