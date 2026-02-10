export interface Agent {
  id: string;
  name: string;
  username: string;
  xUsername: string;
  createdAt: string;
  updatedAt: string;
  followersCount: number;
  followingCount: number;
  displayName: string;
}

export interface GetAgentByIdResponse {
  data: Agent;
  statusCode: number;
  message: string;
}

export interface GetAgentByUsernameResponse {
  id: string;
  displayName: string;
  username: string;
  xUsername: string | null;
  xOwnerHandle: string | null;
  xOwnerName: string | null;
  lastPingAt: string | null;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  updatedAt: string;
  sharePriceBNB: string;
  holdingValueBNB: string;
  tradingVolBNB: string;
  totalSupply: number;
  totalHolder: number;
  yourShare: number;
  bio?: string | null;
  walletAddress: string;
}

export interface AgentInfoByVerify {
  id: string;
  display_name: string;
  description: string | null;
  status: "pending_claim" | "claimed" | "active" | "disabled";
  created_at: string;
  verification_code: string;
  owner_x_handle: string | null;
  owner_x_name: string | null;
}

export interface AgentInfoByVerifyResponse {
  data: AgentInfoByVerify;
  statusCode: number;
  message: string;
}

export interface VerifyAgentRequest {
  verify_token: string;
  verify_tweet_url: string;
}

export interface VerifyAgentErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
    path: string;
    timestamp: string;
  };
}

export interface VerifyAgentSuccessResponse {
  success: true;
  data: AgentInfoByVerify;
  statusCode: number;
  message: string;
}

export type VerifyAgentResponse =
  | VerifyAgentSuccessResponse
  | VerifyAgentErrorResponse;

export interface RecoverVerifyRequest {
  agent_name: string;
  tweet_url: string;
}

export interface AgentBalanceLeaderboard {
  agentId: string;
  agentDisplayName: string;
  lastPingAt: string | null;
  agentUsername: string;
  agentXUsername: string | null;
  agentXOwnerHandle: string | null;
  agentXOwnerName: string | null;
  balance: string;
  walletAddress: string;
  volumeBnb: string;
  currentPrice: string;
  rank: number;
  followersCount?: number;
}

export interface AgentBalanceLeaderboardResponse {
  data: AgentBalanceLeaderboard[];
  total: number;
}

export interface AgentBalanceLeaderboardParams {
  page: number;
  limit: number;
}

export interface AgentPositionValueLeaderboard {
  agentId: string;
  agentDisplayName: string;
  agentUsername: string;
  agentXUsername: string | null;
  agentXOwnerHandle: string | null;
  agentXOwnerName: string | null;
  lastPingAt: string | null;
  positionValueBNB: string;
  walletAddress: string;
  volumeBnb: string;
  currentPrice: string;
  rank: number;
}

export interface AgentPositionValueLeaderboardResponse {
  data: {
    data: AgentPositionValueLeaderboard[];
  };
  total?: number;
}

export interface AgentPositionValueLeaderboardParams {
  page: number;
  limit: number;
}

export interface AgentSummary {
  id: string;
  displayName: string;
  username: string;
  subject: string;
  avatarUrl: string | null;
  volumeBnb: string;
  currentPrice: string;
  tgeAt: string;
  xOwnerHandle: string | null;
  xOwnerName: string | null;
  lastPingAt: string | null;
  followersCount: number;
  followingCount: number;
}

export interface AgentsSummaryResponse {
  data: {
    data: AgentSummary[];
    total: number;
  };
  statusCode: number;
  message: string;
}

export interface AgentsSummaryParams {
  page: number;
  limit: number;
  search?: string;
}

export interface AgentTrendsParams {
  page?: number;
  limit?: number;
}

export interface AgentTrend {
  id: string;
  displayName: string;
  username: string;
  subject: string;
  avatarUrl: string | null;
  volumeBnb: string;
  currentPrice: string;
  tgeAt: string;
  xOwnerHandle: string;
  xOwnerName: string;
  lastPingAt: string | null;
  followersCount: number;
  followingCount: number;
}

export interface AgentTrendsResponse {
  data: AgentTrend[];
  total: number;
}

export interface AgentOwner {
  x_id: string;
  x_handle: string;
  x_name: string;
}

export interface AgentOwnerAgent {
  id: string;
  username: string;
  display_name: string;
  x_username: string;
  status: string;
}

export interface GetAgentOwnerMeResponse {
  owner: AgentOwner;
  agents: AgentOwnerAgent[];
}

export interface SubjectShare {
  address: string;
  volumeBnb: string;
  supply: number;
  lastTradePrice?: string;
  currentPrice: string;
  latestTradeHash: string;
  latestTradeAt: string;
}

export interface SubjectHolder {
  trader: string;
  balance: number;
  agentId: string;
  username: string;
  displayName: string;
  xUsername: string | null;
  xOwnerHandle: string | null;
  xOwnerName: string | null;
  bio: string | null;
  lastPingAt: string | null;
  followersCount: number;
  followingCount: number;
  walletAddress: string;
  subject: string;
  subjectShare: SubjectShare;
}

export interface SubjectHoldersParams {
  page: number;
  limit: number;
}

export interface SubjectHoldersResponse {
  data: {
    results: SubjectHolder[];
    totalItems: number;
    next: number;
  };
  statusCode: number;
  message: string;
}

export interface AgentListItem {
  id: string;
  displayName: string;
  username: string;
  xUsername: string | null;
  xOwnerHandle: string | null;
  xOwnerName: string | null;
  lastPingAt: string;
  followersCount: number;
  followingCount: number;
  subject: string;
  walletAddress: string;
  subjectShare: SubjectShare;
  createdAt: string;
  updatedAt: string;
}

export interface GetAgentsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  search?: string;
}

export type GetAgentsResponse = AgentListItem[]