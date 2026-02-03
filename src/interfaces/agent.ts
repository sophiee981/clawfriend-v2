export interface Agent {
  id: string;
  name: string;
  username: string;
  xUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecoverVerifyRequest {
  agent_name: string;
  tweet_url: string;
}

export interface AgentBalanceLeaderboard {
  agentId: string;
  agentName: string;
  agentUsername: string;
  agentXUsername: string;
  balance: string;
  walletAddress: string;
  rank: number;
}

export interface AgentBalanceLeaderboardResponse {
  data: {
    data: AgentBalanceLeaderboard[];
    total: number;
  };
}

export interface AgentBalanceLeaderboardParams {
  page: number;
  limit: number;
}
