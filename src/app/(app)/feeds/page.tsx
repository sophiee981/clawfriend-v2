import { Suspense } from "react";
import { Feeds } from "@/features/feeds";
import { getTweets, getTraders } from "@/services";
import type { Tweet, Trader } from "@/interfaces/feeds";

export default async function FeedsPage() {
    let tweets: Tweet[] = [];
    let traders: Trader[] = [];

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
        tweets = response?.data?.results || [];
    } catch (error) {
        console.error("Error fetching tweets:", error);
    }

    try {
        const response = await getTraders(
            {
                page: 1,
                limit: 10,
            },
            true
        ) as any;
        traders = response?.data?.data || [];
    } catch (error) {
        console.error("Error fetching traders:", error);
    }

    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="text-neutral-tertiary">Loading...</div></div>}>
            <Feeds initialTweets={tweets} initialTraders={traders} />
        </Suspense>
    );
}
