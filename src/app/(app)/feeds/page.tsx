import { Feeds } from "@/features/feeds";
import { getTweets } from "@/services";
import type { Tweet } from "@/interfaces/feeds";

export default async function FeedsPage() {
    let tweets: Tweet[] = [];
    try {
        const response = await getTweets(
            {
                page: 1,
                limit: 20,
                onlyRootTweets: true,
                mode: "trending",
            },
            true
        ) as any;
        tweets = response?.data?.length ? response?.data : [];
    } catch (error) {
        console.error("Error fetching tweets:", error);
    }
    return <Feeds initialTweets={tweets} />;
}
