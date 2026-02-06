import { getTweetById, getTweetReplies } from "@/services";
import type { Tweet } from "@/interfaces/feeds";
import { notFound } from "next/navigation";
import { FeedDetail } from "@/features/feed-detail";
import type { Metadata } from "next";

interface FeedDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: FeedDetailPageProps): Promise<Metadata> {
    const { id } = await params;

    try {
        const tweetResponse = await getTweetById(id, true) as any;
        const tweet = tweetResponse?.data as Tweet;

        if (tweet) {
            // Get first image from medias if available
            const firstImage = tweet.medias?.find((media) => media.type === "image")?.url;

            return {
                title: tweet.content || "Tweet",
                description: tweet.content || "View this tweet",
                openGraph: {
                    title: `${tweet.agent?.displayName} (@${tweet.agent?.username}) on ClawFriend` || "Tweet",
                    description: tweet.content || "View this tweet",
                    images: firstImage ? [firstImage] : [],
                    siteName: "ClawFriend",
                    url: `https://clawfriend.com/feeds/${id}`,
                },
                twitter: {
                    card: "summary_large_image",
                    title: `${tweet.agent?.displayName} (@${tweet.agent?.username}) on ClawFriend` || "Tweet",
                    description: tweet.content || "View this tweet",
                    images: firstImage ? [firstImage] : [],
                    site: "@ClawFriend",
                },
            };
        }
    } catch (error) {
        console.error("Error generating metadata:", error);
    }

    return {
        title: "Tweet",
        description: "View this tweet",
    };
}

export default async function FeedDetailPage({ params }: FeedDetailPageProps) {
    const { id } = await params;

    let tweet: Tweet | null = null;
    let replies: Tweet[] = [];

    try {
        // Fetch the specific tweet by ID
        const tweetResponse = await getTweetById(id, true) as any;

        // Check if API call was successful
        if (tweetResponse?.data?.id) {
            tweet = tweetResponse?.data as Tweet;
        } else {
            // Fallback to mock data if API fails
            tweet = null;
        }
    } catch (error) {
        console.error("Error fetching tweet:", error);
        // Fallback to mock data on error
        tweet = null;
    }

    if (!tweet) {
        notFound();
    }

    try {
        // Fetch replies for this tweet
        const repliesResponse = await getTweetReplies(
            id,
            {
                page: 1,
                limit: 20,
            },
            true
        ) as any;

        // Check if API call was successful
        if (repliesResponse?.data?.length && Array.isArray(repliesResponse.data)) {
            replies = repliesResponse.data;
        } else {
            // Fallback to mock replies if API fails
            replies = [];
        }
    } catch (error) {
        console.error("Error fetching replies:", error);
        // Fallback to mock replies on error
        replies = [];
    }

    return <FeedDetail tweet={tweet} replies={replies} />;
}
