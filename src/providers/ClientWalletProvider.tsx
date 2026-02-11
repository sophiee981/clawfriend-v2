"use client";

import { chains, dappMetadata, supportedChains } from "@/configs/wallet.config";
import { IConnector, WalletProvider } from "@phoenix-wallet/core";
import {
  BinanceEvmConnector,
  CoinbaseEvmConnector,
  MetamaskEvmConnector,
  RabbyEvmConnector,
  TrustWalletEvmConnector,
} from "@phoenix-wallet/evm";
import { createContext, useContext, useEffect, useState } from "react";

interface ClientWalletContextType {
  isWalletReady: boolean;
}

const ClientWalletContext = createContext<ClientWalletContextType>({
  isWalletReady: false,
});

export const useClientWallet = () => {
  const context = useContext(ClientWalletContext);
  if (!context) {
    throw new Error(
      "useClientWallet must be used within a ClientWalletProvider"
    );
  }
  return context;
};

export const ClientWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connectors, setConnectors] = useState<IConnector[]>([]);
  const [isWalletReady, setIsWalletReady] = useState(false);

  useEffect(() => {
    setIsWalletReady(true);

    const initializeConnectors = () => {
      const baseConnectors: IConnector[] = [
        new BinanceEvmConnector(dappMetadata, supportedChains),
        new MetamaskEvmConnector(dappMetadata, supportedChains),
        new RabbyEvmConnector(dappMetadata, supportedChains),
        new CoinbaseEvmConnector(dappMetadata, supportedChains),
        new TrustWalletEvmConnector(dappMetadata, supportedChains),
      ];

      setConnectors(baseConnectors);
    };

    initializeConnectors();
  }, []);

  return (
    <ClientWalletContext.Provider value={{ isWalletReady }}>
      <WalletProvider
        connectors={isWalletReady ? connectors : []}
        chainConfigs={chains}
        loggerConfig={{ enabled: true }}
      >
        {children}
      </WalletProvider>
    </ClientWalletContext.Provider>
  );
};
