import type { IChainConfig, IConnector } from "@phoenix-wallet/core";
import {
  ChainType,
  useWalletBase,
  type UseWalletCallbacks,
  type WalletState,
} from "@phoenix-wallet/core";
import { EvmChain, EvmConnector, EvmWallet } from "@phoenix-wallet/evm";
import { useCallback } from "react";

export function useWallet<W = any>(
  connectorId: string,
  callbacks?: UseWalletCallbacks<any>
): WalletState<W> {
  const createWallet = useCallback(
    (
      connector: IConnector,
      address: string,
      chainId: string,
      chainConfigs: IChainConfig[]
    ) => {
      try {
        // Find the chain config from the provided chainConfigs
        const chainConfig = chainConfigs.find(
          (c) => c.id === chainId || c.chainId?.toString() === chainId
        );

        if (!chainConfig) {
          console.warn(`Chain with ID ${chainId} not found in chainConfigs`);
          return null;
        }

        switch (connector.chainType) {
          case ChainType.EVM: {
            const evmConnector = connector as EvmConnector;
            const evmChain = new EvmChain(chainConfig.name, chainConfig as any);
            const walletClient = (evmConnector as any).createWalletClient(
              evmChain
            );
            return new EvmWallet(
              address,
              evmChain,
              evmConnector,
              walletClient
            ) as any;
          }

          default:
            console.warn(`Unsupported chain type: ${connector.chainType}`);
            return null;
        }
      } catch (error) {
        console.error("Failed to create wallet:", error);
        return null;
      }
    },
    [connectorId]
  );

  return useWalletBase<any>(connectorId, createWallet, callbacks);
}
