"use client";
import { chains } from "@/configs/wallet.config";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/utils/toast";
import {
  IChainConfig,
  IConnector,
  IWallet,
  useWalletConnectors,
} from "@phoenix-wallet/core";
import { EvmChain } from "@phoenix-wallet/evm";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPublicClient, http } from "viem";

interface AuthContextProps {
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string;
  wallet: IWallet<any, any, IConnector, any> | null;
  chainId: string | null;
  connect: (walletType?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;
  getWallet: () => IWallet<any, any, IConnector, any> | null;
  setConnectorId: (connectorId: string) => void;
  lastUsedConnectorId: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const useConnectorStorage = () => {
  const [connectorId, setConnectorId] = useState<string>("");

  useEffect(() => {
    const savedConnectorId = localStorage.getItem("connectorId") || "";

    if (savedConnectorId) {
      setConnectorId(savedConnectorId);
    }
  }, []);

  return { connectorId, setConnectorId };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { connectorId, setConnectorId } = useConnectorStorage();
  const [lastUsedConnectorId, setLastUsedConnectorId] = useState<string>("");
  const { connectors } = useWalletConnectors();
  const previousWalletAddress = useRef<string>("");
  const {
    connect,
    getWallet,
    isConnected,
    switchChain: walletSwitchChain,
    wallet,
    disconnect,
    address: walletAddress,
    chainId,
    isConnecting,
  } = useWallet(connectorId, {});

  const switchChain = useCallback(
    async (chainId: string): Promise<void> => {
      await walletSwitchChain(chainId);
    },
    [walletSwitchChain]
  );

  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }, [disconnect]);

  const handleAddChain = useCallback(
    async (
      addChainId: string,
      connector: IConnector,
      options?: { silent?: boolean }
    ) => {
      if (!connector || !addChainId) return;

      try {
        const chainToAdd = chains.find(
          (chain: IChainConfig) => chain.chainId === Number(addChainId)
        );
        if (!chainToAdd) throw new Error("Selected chain not found");

        const provider = createPublicClient({
          transport: http(chainToAdd.publicRpcUrl),
        });
        const chainWithProvider = {
          ...chainToAdd,
          chainName: chainToAdd.name,
          provider,
        };
        const evmChain = new EvmChain(
          chainToAdd.name,
          chainWithProvider as any
        );

        await connector.addChain(evmChain);

        if (!options?.silent) {
          toast.success(`Successfully added chain: ${chainToAdd.name}`, {});
        }
      } catch (error: any) {
        throw error;
      }
    },
    []
  );

  const signInWithWallet = useCallback(async () => {
    try {
      const desiredChainIds = chains.map((chain) => chain.chainId.toString());

      if (!desiredChainIds.includes(chainId || "")) {
        try {
          await switchChain(desiredChainIds[0]);
        } catch (err) {
          try {
            const _activeConnector = connectors.find(
              (connector) => connector.id === connectorId
            );
            await handleAddChain(
              desiredChainIds[0],
              _activeConnector as IConnector,
              { silent: true }
            );
            await switchChain(desiredChainIds[0]);
          } catch (addErr) {
            toast.error("Switch/add chain failed: " + addErr);
            await disconnectWallet();
            return;
          }
        }
      }
      if (!wallet) return;
      localStorage.setItem("connectorId", connectorId);
    } catch (error: any) {
      toast.error("wallet rugged 💀", {
        description: "try again or switch network, anon.",
      });
      await disconnectWallet();
    } finally {
    }
  }, [wallet, connectorId, chainId, switchChain, disconnectWallet]);

  const hasWalletAddressChanged = useMemo(
    () =>
      walletAddress &&
      previousWalletAddress.current &&
      walletAddress.toLowerCase() !==
        previousWalletAddress.current.toLowerCase() &&
      isConnected,
    [walletAddress, previousWalletAddress, isConnected]
  );

  useEffect(() => {
    if (connectorId) {
      setLastUsedConnectorId(connectorId);
    }
  }, [connectorId, setLastUsedConnectorId]);

  // Handle wallet address change
  useEffect(() => {
    if (hasWalletAddressChanged) {
      disconnectWallet();
      toast.error(
        "Wallet address changed! Please sign in again with your new wallet."
      );
      return;
    }
  }, [hasWalletAddressChanged, disconnectWallet]);

  // Handle sign in with wallet when user is connected
  useEffect(() => {
    if (!isConnected || !walletAddress) return;

    signInWithWallet();
  }, [isConnected, walletAddress, signInWithWallet]);

  const contextValue: AuthContextProps = {
    chainId,
    isConnected,
    isConnecting: isConnecting,
    walletAddress: walletAddress || "",
    wallet,
    connect,
    disconnect: disconnectWallet,
    switchChain,
    getWallet,
    setConnectorId,
    lastUsedConnectorId,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
