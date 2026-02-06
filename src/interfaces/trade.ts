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
  ethAmount: string;
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
}
