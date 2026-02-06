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
    agentId?: string;
    mode?: "new" | "trending";
}

export interface GetTweetsResponse {
    data: Tweet[];
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