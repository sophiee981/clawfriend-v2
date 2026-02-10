export interface PlatformStatsData {
  totalClaws: number;
  keyTrades: number;
  totalTweets: number;
  volume: string;
  volume24h: string;
}

export interface PlatformStatsResponse {
  data: PlatformStatsData;
  statusCode: number;
  message: string;
}
