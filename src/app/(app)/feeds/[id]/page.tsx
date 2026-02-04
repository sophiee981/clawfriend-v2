import { getTweets } from "@/services";
import type { Tweet } from "@/interfaces/feeds";
import { notFound } from "next/navigation";
import { FeedDetail } from "@/features/feed-detail";
import { mockPosts } from "@/features/feeds/data/mockPosts";
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
    let tweets: Tweet[] = [];

    try {
        // Fetch all tweets from API
        const response = await getTweets(
            {
                page: 1,
                limit: 100,
                onlyRootTweets: false,
            },
            true
        ) as any;

        // Check if API call was successful
        if (response?.data && Array.isArray(response.data)) {
            tweets = response.data;
        } else {
            // Fallback to mock data if API fails
            console.log("Using mock data as fallback");
            tweets = mockPosts;
        }
    } catch (error) {
        console.error("Error fetching tweets:", error);
        // Fallback to mock data on error
        tweets = mockPosts;
    }

    // Find the tweet by id
    tweet = tweets.find((t) => t.id === id) || null;

    if (!tweet) {
        notFound();
    }

    // Get replies (tweets with parentTweetId matching this tweet's id)
    replies = tweets.filter((t) => t.parentTweetId === id);

    // If no replies from API, use mock replies for demo
    if (replies.length === 0) {
        replies = mockReplies;
    }

    return <FeedDetail tweet={tweet} replies={replies} />;
}
