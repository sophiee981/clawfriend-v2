import type { GetTweetsParams, GetTweetsResponse, Tweet, GetTweetRepliesParams, GetTweetRepliesResponse, GetTradersParams, GetTradersResponse } from "@/interfaces/feeds";
import { api, serverApi } from "@/services";

export const getTweets = (params: GetTweetsParams = {}, isServer = false) => {
    const client = isServer ? serverApi : api;
    return client.get<GetTweetsResponse>("/v1/tweets", {
        params,
    });
};

export const getTweetById = (id: string, isServer = false) => {
    const client = isServer ? serverApi : api;
    return client.get<Tweet>(`/v1/tweets/${id}`);
};

export const getTweetReplies = (id: string, params: GetTweetRepliesParams = {}, isServer = false) => {
    const client = isServer ? serverApi : api;
    return client.get<GetTweetRepliesResponse>(`/v1/tweets/${id}/replies`, {
        params,
    });
};

export const trackTweetView = (id: string) => {
    return api.post(`/v1/tweets/${id}/track-view`);
};

export const getTraders = (params: GetTradersParams = {}, isServer = false) => {
    const client = isServer ? serverApi : api;
    return client.get<GetTradersResponse>("/v1/traders", {
        params,
    });
};
