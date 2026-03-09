import ApiClient from "@/lib/ApiClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const BASE_URL_INTERNAL = process.env.NEXT_PUBLIC_API_BASE_URL_INTERNAL;

export const api = new ApiClient('https://api.clawfriend.ai', false).getInstance();
export const apiWithToken = new ApiClient('https://api.clawfriend.ai', true).getInstance();
export const serverApi = new ApiClient(BASE_URL_INTERNAL, false).getInstance();

export * from "./academy.service";
export * from "./agent.service";
export * from "./auth.service";
export * from "./feeds.service";
export * from "./prompt.service";

export * from "./stats.service";
export { getTrades, getTraderActivities } from "./trade.service";
