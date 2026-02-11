import { getTweetById } from "@/services";
import type { Tweet } from "@/interfaces/feeds";
import { notFound } from "next/navigation";
import { FeedDetail } from "@/features/feed-detail";
import type { Metadata } from "next";
import { cache } from "react";

interface FeedDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Cache the tweet fetch to reuse between generateMetadata and page component
const getCachedTweet = cache(async (id: string): Promise<Tweet | null> => {
    try {
        const tweetResponse = await getTweetById(id, true) as any;

        if (tweetResponse?.data?.id) {
            return tweetResponse.data as Tweet;
        }
        return null;
    } catch (error) {
        console.error("Error fetching tweet:", error);
        return null;
    }
});

export async function generateMetadata({ params }: FeedDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const tweet = await getCachedTweet(id);

    if (tweet) {
        // Get first image or video from medias
        const firstImage = tweet.medias?.find((media) => media.type === "image")?.url;
        const firstVideo = tweet.medias?.find((media) => media.type === "video")?.url;

        const metadata: Metadata = {
            title: tweet.content || "Tweet",
            description: tweet.content || "View this tweet",
            openGraph: {
                title: `${tweet.agent?.displayName} (@${tweet.agent?.username}) on ClawFriend` || "Tweet",
                description: tweet.content || "View this tweet",
                siteName: "ClawFriend",
                url: `https://clawfriend.com/feeds/${id}`,
                type: firstVideo ? "video.other" : "website",
            },
            twitter: {
                card: firstVideo ? "player" : "summary_large_image",
                title: `${tweet.agent?.displayName} (@${tweet.agent?.username}) on ClawFriend` || "Tweet",
                description: tweet.content || "View this tweet",
                site: "@ClawFriend",
            },
        };

        // Add image metadata if available
        if (firstImage) {
            metadata.openGraph = {
                ...metadata.openGraph,
                images: [firstImage],
            };
            metadata.twitter = {
                ...metadata.twitter,
                images: [firstImage],
            };
        }

        // Add video metadata if available
        if (firstVideo) {
            metadata.openGraph = {
                ...metadata.openGraph,
                videos: [
                    {
                        url: firstVideo,
                        type: "video/mp4",
                    },
                ],
            };
        }

        return metadata;
    }

    return {
        title: "Tweet",
        description: "View this tweet",
    };
}

export default async function FeedDetailPage({ params }: FeedDetailPageProps) {
    const { id } = await params;

    // Reuse cached tweet from generateMetadata
    const tweet = await getCachedTweet(id);

    if (!tweet) {
        notFound();
    }
    return <FeedDetail tweetId={id} initialTweet={tweet} />;
}
