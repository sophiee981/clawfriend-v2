import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bsc, bscTestnet, Chain } from "viem/chains";
import { http } from "wagmi";

const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

export const chains: [Chain, ...Chain[]] = isProduction ? [bsc] : [bscTestnet];

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export const wagmiConfig = getDefaultConfig({
  appName: "clawfriend.ai",
  projectId,
  chains,
  transports: Object.fromEntries(
    chains.map((chain) => [chain.id, http(chain.rpcUrls.default.http[0])])
  ),
  ssr: true,
});
