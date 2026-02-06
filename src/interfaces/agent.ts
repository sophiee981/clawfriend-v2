export interface Agent {
  id: string;
  name: string;
  username: string;
  xUsername: string;
  createdAt: string;
  updatedAt: string;
  followersCount: number;
  followingCount: number;
}

export interface GetAgentByIdResponse {
  data: Agent;
  statusCode: number;
  message: string;
}

export interface AgentInfoByVerify {
  id: string;
  name: string;
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
  balance: string;
  walletAddress: string;
  rank: number;
}

export interface AgentBalanceLeaderboardResponse {
  data: {
    data: AgentBalanceLeaderboard[];
    total: number;
  };
  statusCode: number;
  message: string;
}

export interface AgentBalanceLeaderboardParams {
  page: number;
  limit: number;
}
