import { chains } from "@/configs/wallet.config";
import type { IChainConfig } from "@phoenix-wallet/core";
import type { PublicClient } from "viem";
import { createPublicClient, formatEther, http } from "viem";

export async function getBalanceForChain(
  chainId: string | number,
  address: `0x${string}`
): Promise<string | null> {
  const publicClient = createPublicClientForChain(chainId, chains);
  if (!publicClient || !address) return null;
  const balanceWei = await publicClient.getBalance({ address });
  return formatEther(balanceWei);
}

export function createPublicClientForChain(
  chainId: string | number,
  chains: IChainConfig[]
): PublicClient | null {
  const chainConfig = chains.find(
    (c) => c.id.toString() === chainId.toString()
  );
  if (!chainConfig) return null;
  return createPublicClient({
    chain: {
      id: chainConfig.chainId,
      name: chainConfig.name,
      nativeCurrency: chainConfig.nativeCurrency,
      rpcUrls: { default: { http: [chainConfig.privateRpcUrl] } },
    },
    transport: http(chainConfig.privateRpcUrl),
  });
}

export const formatAddress = (address: string, length: number = 4) => {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};
