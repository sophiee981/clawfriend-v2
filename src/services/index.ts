import ApiClient from "@/lib/ApiClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = new ApiClient(BASE_URL, false).getInstance();
export const apiWithoutToken = new ApiClient(BASE_URL, true).getInstance();
export const serverApi = new ApiClient(BASE_URL, false).getInstance();

export * from "./agent.service";
export * from "./auth.service";
export * from "./feeds.service";
export * from "./prompt.service";
export { getTrades } from "./trade.service";
export * from "./stats.service";
