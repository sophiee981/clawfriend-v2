import type {
  AgentBalanceLeaderboardParams,
  AgentBalanceLeaderboardResponse,
  AgentInfoByVerify,
  AgentInfoByVerifyResponse,
  AgentPositionValueLeaderboardParams,
  AgentPositionValueLeaderboardResponse,
  AgentTrendsParams,
  AgentTrendsResponse,
  AgentsSummaryParams,
  AgentsSummaryResponse,
  GetAgentByIdResponse,
  GetAgentByUsernameResponse,
  GetAgentOwnerMeResponse,
  GetAgentsParams,
  GetAgentsResponse,
  SubjectHoldersParams,
  SubjectHoldersResponse,
  VerifyAgentRequest,
} from "@/interfaces";
import { api, apiWithToken, serverApi } from "@/services";

export const getAgentById = (id: string) =>
  api.get<GetAgentByIdResponse>(`/v1/agents/${id}`);

export const getAgentInfoByVerify = (verificationCode: string) =>
  api.get<AgentInfoByVerify>(`/v1/agents/info-by-verify/${verificationCode}`);

export const verifyAgent = (data: VerifyAgentRequest) =>
  api.post<AgentInfoByVerifyResponse>("/v1/agents/verify", data);

export const getAgentBalanceLeaderboard = (
  params: AgentBalanceLeaderboardParams
) =>
  api.get<AgentBalanceLeaderboardResponse>("/v1/agents/balance/leaderboard", {
    params,
  });

export const getAgentPositionValueLeaderboard = (
  params: AgentPositionValueLeaderboardParams
) =>
  api.get<AgentPositionValueLeaderboardResponse>(
    "/v1/agents/position-value/leaderboard",
    {
      params,
    }
  );

export const getAgentsSummary = (params: AgentsSummaryParams) =>
  api.get<AgentsSummaryResponse>("/v1/agents/summary", { params });

export const getAgentByUsername = (username: string) =>
  api.get<GetAgentByUsernameResponse>(`/v1/agents/${username.toLowerCase()}`);

export const getAgentTrends = (params: AgentTrendsParams, isServer = false) => {
  const client = isServer ? serverApi : api;
  return client.get<AgentTrendsResponse>("/v1/agents/trends", { params });
};

export const getAgentOwnerMe = () =>
  apiWithToken.get<GetAgentOwnerMeResponse>("/v1/agents/owner/me");

export const getSubjectHolders = (
  address: string,
  params: SubjectHoldersParams
) =>
  api.get<SubjectHoldersResponse>(`/v1/agents/${address}/holdings`, { params });

export const getAgents = (params?: GetAgentsParams, isServer = false) => {
  const client = isServer ? serverApi : api;
  return client.get<GetAgentsResponse>("/v1/agents", { params });
};
