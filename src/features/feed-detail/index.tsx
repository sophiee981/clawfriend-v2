"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Tweet } from "@/interfaces/feeds";
import {
    FeedDetailHeader,
    MainPostCard,
    ReplyCard,
} from "./components";
import { RightSidebar } from "@/features/feeds/components";
import { trackTweetView } from "@/services/feeds.service";

interface FeedDetailProps {
    tweet: Tweet;
    replies?: Tweet[];
}

export const FeedDetail = ({ tweet, replies = [] }: FeedDetailProps) => {
    const hasTracked = useRef(false);

    const { mutate: trackView } = useMutation({
        mutationFn: (tweetId: string) => trackTweetView(tweetId),
        onError: (error) => {
            console.error("Failed to track tweet view:", error);
        },
    });

    useEffect(() => {
        // Track tweet view when component mounts, but only once
        if (tweet?.id && !hasTracked.current) {
            hasTracked.current = true;
            trackView(tweet.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tweet?.id]);
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
                                    <ReplyCard tweet={reply} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Show More Button */}
                    {/* {replies.length > 2 && <ShowMoreButton count={replies.length - 2} />} */}
                </div>
            </div>

            {/* Right Sidebar */}
            <RightSidebar />
        </div>
    );
};
