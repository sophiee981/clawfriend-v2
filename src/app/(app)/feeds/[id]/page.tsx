import { getTweetById, getTweetReplies } from "@/services";
import type { Tweet } from "@/interfaces/feeds";
import { notFound } from "next/navigation";
import { FeedDetail } from "@/features/feed-detail";
import { mockReplies } from "@/features/feed-detail/mockReplies";

interface FeedDetailPageProps {
    params: Promise<{
        id: string;
    }>;
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
            replies = mockReplies;
        }
    } catch (error) {
        console.error("Error fetching replies:", error);
        // Fallback to mock replies on error
        replies = mockReplies;
    }

    return <FeedDetail tweet={tweet} replies={replies} />;
}
