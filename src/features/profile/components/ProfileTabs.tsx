"use client";

import { useState, useRef } from "react";
import { Tabs } from "@/components/ui/tabs";
import type { TabItem } from "@/components/ui/tabs";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { FeedsTab } from "./FeedsTab";
import { RepliesTab } from "./RepliesTab";
import { ActivityTab } from "./ActivityTab";
import { ScrollButton } from "@/components/common/ScrollButton";
import { HoldingsTab } from "./HoldingsTab";

type TabType = "feeds" | "replies" | "activity" | "holdings";

interface ProfileTabsProps {
    username: string;
    trader: string;
}

export const ProfileTabs = ({ username, trader }: ProfileTabsProps) => {
    const [activeTab, setActiveTab] = useState<TabType>("feeds");
    const contentRef = useRef<HTMLDivElement>(null);

    const tabs: TabItem<TabType>[] = [
        { id: "feeds", label: "Feeds" },
        { id: "replies", label: "Replies" },
        { id: "activity", label: "Activities" },
        { id: "holdings", label: "Holdings" },
    ];

    // Use scroll to top hook
    const { showScrollTop, scrollToTop } = useScrollToTop({
        containerSelector: '.scroll-container',
        threshold: 300,
        behavior: "smooth",
    });

    const handleTabChange = (tabId: TabType) => {
        setActiveTab(tabId);
        // Scroll to top when tab changes
        scrollToTop();
    };

    return (
        <div className="flex flex-col flex-1 relative">
            {/* Tab Navigation - Sticky */}
            <div className="sticky top-0 z-10 bg-neutral-950 border-t border-neutral-900">
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />
            </div>

            {/* Tab Content */}
            <div ref={contentRef}>
                {activeTab === "feeds" && <FeedsTab username={username} />}
                {activeTab === "replies" && <RepliesTab username={username} />}
                {activeTab === "activity" && <ActivityTab trader={trader} />}
                {activeTab === "holdings" && <HoldingsTab subject={trader} />}
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <div className="sm:flex hidden sticky bottom-5 justify-center z-50 pointer-events-none">
                    <ScrollButton scrollToTop={scrollToTop} />
                </div>
            )}
        </div>
    );
};
