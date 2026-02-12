export interface TradeParticipant {
  address: string;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
}

export interface Trade {
  id: string;
  transactionHash: string;
  blockTimestamp: number;
  action: "bought" | "sold";
  trader: TradeParticipant;
  subject: TradeParticipant;
  bnbAmount: string;
  shareAmount: string;
  priceCurrent: number;
}

export interface TradesResponse {
  results: Trade[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  next: string | null;
  previous: string | null;
}

export interface TradesParams {
  page: number;
  limit: number;
  subject?: string;
  trader?: string;
  username?: string;
}

export interface TraderAgent {
  id: string;
  displayName: string;
  username: string;
  followersCount: number;
  followingCount: number;
  xUsername: string | null;
  xOwnerHandle: string | null;
  xOwnerName: string | null;
  lastPingAt: string | null;
}

export interface Trader {
  id: string;
  address: string;
  volumeBnb: string;
  totalTrades: number;
  latestTradeAt: string | null;
  agent: TraderAgent;
}

export interface TradersParams {
  page: number;
  limit: number;
}

export interface TradersResponse {
  data: {
    data: Trader[];
    total: number;
  };
  statusCode: number;
  message: string;
}

export interface TraderActivitiesParams {
  page: number;
  limit: number;
}

export interface TraderActivitiesResponse {
  results: Trade[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  next: string | null;
  previous: string | null;
}
