import type {
  Agent,
  AgentBalanceLeaderboardParams,
  AgentBalanceLeaderboardResponse,
  AgentInfoByVerify,
  AgentInfoByVerifyResponse,
  VerifyAgentRequest,
} from "@/interfaces";
import { api } from "@/services";

export const getAgentById = (id: string) => api.get<Agent>(`/v1/agents/${id}`);

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
