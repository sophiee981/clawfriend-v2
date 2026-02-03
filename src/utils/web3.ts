import { createPublicClient, formatEther, http } from "viem";
import { mainnet } from "viem/chains";

const MAINNET_RPC_URL = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;

/**
 * Get ETH balance of an address on Ethereum mainnet
 */
export async function getBalance(address: `0x${string}`): Promise<string> {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(MAINNET_RPC_URL),
  });

  const balanceWei = await client.getBalance({
    address,
  });

  return formatEther(balanceWei);
}

export const formatAddress = (address: string, length: number = 4) => {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};
