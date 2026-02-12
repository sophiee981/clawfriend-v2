"use client";

import { chains } from "@/configs/wallet.config";
import { toast } from "@/utils/toast";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  useConnect,
  useConnection,
  useDisconnect,
  useSwitchChain,
  useWalletClient,
} from "wagmi";

interface AuthContextProps {
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string;
  wallet: {
    address: string;
    walletClient: ReturnType<typeof useWalletClient>["data"];
  } | null;
  chainId: string | null;
  disconnect: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const previousWalletAddress = useRef<string>("");
  const { address, isConnected, chain } = useConnection();
  const { isPending: isConnecting } = useConnect();
  const { mutateAsync: disconnectAsync } = useDisconnect();
  const { mutateAsync: switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();

  const walletAddress = address ?? "";
  const chainId = chain?.id?.toString() ?? null;

  const wallet = useMemo(() => {
    if (!address || !walletClient) return null;
    return { address, walletClient };
  }, [address, walletClient]);

  const disconnect = useCallback(async () => {
    try {
      await disconnectAsync?.();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }, [disconnectAsync]);

  const switchChain = useCallback(
    async (targetChainId: string): Promise<void> => {
      await switchChainAsync?.({
        chainId: Number(targetChainId),
      });
    },
    [switchChainAsync]
  );

  const signInWithWallet = useCallback(async () => {
    try {
      const desiredChainIds = chains.map((c) => c.id.toString());

      if (!desiredChainIds.includes(chainId || "")) {
        try {
          await switchChain(desiredChainIds[0]);
        } catch (err) {
          toast.error("Switch/add chain failed: " + (err as Error)?.message);
          await disconnect();
          return;
        }
      }
    } catch (error) {
      toast.error("wallet rugged 💀", {
        description: "try again or switch network, anon.",
      });
      await disconnect();
    }
  }, [chainId, switchChain, disconnect]);

  const hasWalletAddressChanged = useMemo(
    () =>
      walletAddress &&
      previousWalletAddress.current &&
      walletAddress.toLowerCase() !==
        previousWalletAddress.current.toLowerCase() &&
      isConnected,
    [walletAddress, isConnected]
  );

  useEffect(() => {
    if (walletAddress) {
      previousWalletAddress.current = walletAddress;
    }
  }, [walletAddress]);

  useEffect(() => {
    if (hasWalletAddressChanged) {
      disconnect();
      toast.error(
        "Wallet address changed! Please sign in again with your new wallet."
      );
    }
  }, [hasWalletAddressChanged, disconnect]);

  useEffect(() => {
    if (!isConnected || !walletAddress) return;
    signInWithWallet();
  }, [isConnected, walletAddress, signInWithWallet]);

  const contextValue: AuthContextProps = {
    chainId,
    isConnected,
    isConnecting,
    walletAddress,
    wallet,
    disconnect,
    switchChain,
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
