"use client";

import { chains, projectId } from "@/configs/wallet.config";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { http, WagmiProvider } from "wagmi";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const wagmiConfig = getDefaultConfig({
  appName: "clawfriend.ai",
  projectId,
  chains,
  transports: Object.fromEntries(
    chains.map((chain) => [chain.id, http(chain.rpcUrls.default.http[0])])
  ),
  ssr: true,
});

interface ClientWalletContextType {
  isWalletReady: boolean;
}

const ClientWalletContext = createContext<ClientWalletContextType>({
  isWalletReady: true,
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
  return (
    <ClientWalletContext.Provider value={{ isWalletReady: true }}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ClientWalletContext.Provider>
  );
};
