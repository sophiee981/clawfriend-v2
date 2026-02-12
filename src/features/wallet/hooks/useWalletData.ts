"use client";

import { useQuery } from "@tanstack/react-query";
import { getAgentById, getAgentByUsername, getAgents } from "@/services";
import type { GetAgentByUsernameResponse } from "@/interfaces";

export function useWalletData(address: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["wallet-agent", address],
    queryFn: async (): Promise<GetAgentByUsernameResponse | null> => {
      try {
        const response = (await getAgentById(address)) as any;
        const agent = response?.data?.data || response?.data;
        if (agent?.holdingValueBNB != null) return agent;
        if (agent?.username) {
          const full = (await getAgentByUsername(agent.username.toLowerCase())) as any;
          return full?.data || full;
        }
        const agentsResponse = (await getAgents({ limit: 200 })) as any;
        const agents = agentsResponse?.data || [];
        const match = agents.find(
          (a: { walletAddress?: string }) =>
            a.walletAddress?.toLowerCase() === address?.toLowerCase()
        );
        if (match?.username) {
          const full = (await getAgentByUsername(match.username.toLowerCase())) as any;
          return full?.data || full;
        }
        return null;
      } catch {
        return null;
      }
    },
    enabled: !!address,
  });

  const holdingValue = data?.holdingValueBNB ?? "0";

  return {
    holdingValue,
    isLoading,
    agent: data,
  };
}
