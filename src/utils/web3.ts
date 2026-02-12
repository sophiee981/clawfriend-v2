import { chains } from "@/configs/wallet.config";
import type { Chain, PublicClient } from "viem";
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
  chainList: Chain[]
): PublicClient | null {
  const chainConfig = chainList.find(
    (c) => c.id.toString() === chainId.toString()
  );
  if (!chainConfig) return null;
  return createPublicClient({
    chain: chainConfig,
    transport: http(chainConfig.rpcUrls.default.http[0]),
  });
}

export const formatAddress = (address: string, length: number = 4) => {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};
