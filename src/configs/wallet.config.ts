import { ChainType, IChainConfig } from "@phoenix-wallet/core";

export const dappMetadata = { name: "alter.fun", url: "https://alter.fun" };

const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

export const chains: IChainConfig[] = isProduction
  ? [
      {
        id: "56",
        name: "BSC",
        publicRpcUrl: "https://bsc-dataseed1.binance.org",
        privateRpcUrl: "https://bsc-dataseed1.binance.org",
        explorerUrl: "https://bscscan.com",
        chainId: 56,
        nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
        chainType: ChainType.EVM,
      },
    ]
  : [
      {
        id: "97",
        name: "BNB Testnet",
        publicRpcUrl: "https://bsc-testnet-rpc.publicnode.com",
        privateRpcUrl: "https://bsc-testnet-rpc.publicnode.com",
        explorerUrl: "https://testnet.bscscan.com",
        chainId: 97,
        nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
        chainType: ChainType.EVM,
      },
    ];

export const supportedChains = chains.map((chain) => chain.chainId.toString());
