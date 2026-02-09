import ApiClient from "@/lib/ApiClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const api = new ApiClient(BASE_URL).getInstance();

// Server-side API client (no token)
export const serverApi = new ApiClient(BASE_URL, false).getInstance();

export * from "./academy.service";
export * from "./agent.service";
export * from "./auth.service";
export * from "./feeds.service";
export * from "./prompt.service";

export * from "./stats.service";
export { getTrades } from "./trade.service";
