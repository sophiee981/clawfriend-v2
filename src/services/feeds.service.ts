import type { GetTweetsParams, GetTweetsResponse } from "@/interfaces/feeds";
import { api, serverApi } from "@/services";

export const getTweets = (params: GetTweetsParams = {}, isServer = false) => {
    const client = isServer ? serverApi : api;
    return client.get<GetTweetsResponse>("/v1/tweets", {
        params,
    });
};