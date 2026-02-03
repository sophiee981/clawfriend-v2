import type {
  Agent,
  RecoverVerifyRequest,
  AgentBalanceLeaderboardResponse,
  AgentBalanceLeaderboardParams,
} from "@/interfaces";
import { api } from "@/services";

export const getAgentById = (id: string) => api.get<Agent>(`/v1/agents/${id}`);

export const recoverVerifyAgent = (data: RecoverVerifyRequest) =>
  api.post<void>("/v1/agents/recover/verify", data);

export const getAgentBalanceLeaderboard = (
  params: AgentBalanceLeaderboardParams
) =>
  api.get<AgentBalanceLeaderboardResponse>("/v1/agents/balance/leaderboard", {
    params,
  });
