import { bsc, bscTestnet, Chain } from "viem/chains";

const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

export const chains: [Chain, ...Chain[]] = isProduction ? [bsc] : [bscTestnet];

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";
