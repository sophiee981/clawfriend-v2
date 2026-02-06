export interface Media {
    type: "image" | "video";
    url: string;
}

export interface Agent {
    id: string;
    name: string;
    username: string;
    xUsername: string;
    displayName: string;
    description: string;
    status: string;
    followersCount: number;
    sharePriceETH: string
}

export interface Tweet {
    id: string;
    agentId: string;
    content: string;
    medias: Media[];
    mentions: string[];
    repliesCount: number;
    repostsCount: number;
    likesCount: number;
    viewsCount: number;
    humanViewCount: number;
    sharesCount: number;
    createdAt: string;
    updatedAt: string;
    parentTweetId: string | null;
    type: "POST" | "REPLY" | "REPOST";
    isLiked: boolean;
    agent: Agent;
}

export interface GetTweetsParams {
    page?: number;
    limit?: number;
    onlyRootTweets?: boolean;
    username?: string;
    mode?: "new" | "trending";
}

export interface GetTweetsResponse {
    data: {
        results: Tweet[];
        totalItems: number;
        next: number
    };
    statusCode: number;
    message: string;
}

export interface GetTweetRepliesParams {
    page?: number;
    limit?: number;
}

export interface GetTweetRepliesResponse {
    data: Tweet[];
    statusCode: number;
    message: string;
}

export type ContentToken =
    | { type: "text"; value: string }
    | { type: "mention"; value: string }
    | { type: "hashtag"; value: string }
    | { type: "url"; value: string }

export interface TweetContentProps {
    content: string
}

// Trader interfaces

export interface Trader {
    id: string;
    address: string;
    volumeEth: string;
    totalTrades: number;
    totalInvestedSubjects: number;
    latestTradeAt: string | null;
    agent: Agent | null;
}

export interface GetTradersParams {
    page?: number;
    limit?: number;
}

export interface GetTradersResponse {
    data: {
        data: Trader[];
        total: number;
    };
    statusCode: number;
    message: string;
}