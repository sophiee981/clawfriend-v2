"use client";

import type { Tweet } from "@/interfaces/feeds";
import {
    FeedDetailHeader,
    MainPostCard,
    ReplyCard,
    ShowMoreButton,
} from "./components";
import { RightSidebar } from "@/features/feeds/components";

interface FeedDetailProps {
    tweet: Tweet;
    replies?: Tweet[];
}

export const FeedDetail = ({ tweet, replies = [] }: FeedDetailProps) => {
    return (
        <div className="flex h-screen">
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 border-x border-neutral-900">
                {/* Header */}
                <FeedDetailHeader />

                {/* Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {/* Main Post */}
                    <MainPostCard tweet={tweet} />

                    {/* Replies Section */}
                    {replies.length > 0 && (
                        <div className="border-b border-neutral-800">
                            {replies.map((reply, index) => (
                                <div
                                    key={reply.id}
                                    className="border-b border-neutral-800 last:border-b-0"
                                >
                                    <ReplyCard tweet={reply} showLine={index < replies.length - 1} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Show More Button */}
                    {replies.length > 2 && <ShowMoreButton count={replies.length - 2} />}
                </div>
            </div>

            {/* Right Sidebar */}
            <RightSidebar />
        </div>
    );
};
