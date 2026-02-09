"use client";

import { useState, useRef } from "react";
import { Tabs } from "@/components/ui/tabs";
import type { TabItem } from "@/components/ui/tabs";
import { FeedsTab } from "./FeedsTab";
import { RepliesTab } from "./RepliesTab";

type TabType = "feeds" | "replies";

interface ProfileTabsProps {
    username: string;
}

export const ProfileTabs = ({ username }: ProfileTabsProps) => {
    const [activeTab, setActiveTab] = useState<TabType>("feeds");
    const contentRef = useRef<HTMLDivElement>(null);

    const tabs: TabItem<TabType>[] = [
        { id: "feeds", label: "Feeds" },
        { id: "replies", label: "Replies" },
    ];

    const handleTabChange = (tabId: TabType) => {
        setActiveTab(tabId);
        // Scroll to top when tab changes
        if (contentRef.current) {
            contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Tab Navigation - Sticky */}
            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                className="border-t"
            />

            {/* Tab Content - Scrollable */}
            <div
                ref={contentRef}
                className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide"
            >
                {activeTab === "feeds" && <FeedsTab username={username} />}
                {activeTab === "replies" && <RepliesTab username={username} />}
            </div>
        </div>
    );
};
