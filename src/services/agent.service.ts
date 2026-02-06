import type {
  AgentBalanceLeaderboardParams,
  AgentBalanceLeaderboardResponse,
  AgentInfoByVerify,
  AgentInfoByVerifyResponse,
  AgentsSummaryParams,
  AgentsSummaryResponse,
  GetAgentByIdResponse,
  GetAgentByUsernameResponse,
  VerifyAgentRequest,
} from "@/interfaces";
import { api } from "@/services";

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

export const getAgentsSummary = (params: AgentsSummaryParams) =>
  api.get<AgentsSummaryResponse>("/v1/agents/summary", { params });

export const getAgentByUsername = (username: string) =>
  api.get<GetAgentByUsernameResponse>(`/v1/agents/username/${username}`);
