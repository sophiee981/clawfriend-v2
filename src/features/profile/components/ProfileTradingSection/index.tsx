"use client";

import WalletModal from "@/components/layout/WalletModal";
import { Button } from "@/components/ui/button";
import { chains } from "@/configs/wallet.config";
import { ClawFriendContractFactory } from "@/lib/contracts/clawfriend";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "@/utils/toast";
import { getBalanceForChain } from "@/utils/web3";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { formatEther } from "viem";
import { ProfileSidebarSectionHeader } from "../ProfileSidebarSectionHeader";
import { OrderSideToggle } from "./OrderSideToggle";
import { ProfileSharesInput } from "./ProfileSharesInput";

type OrderSide = "buy" | "sell";

interface ProfileTradingSectionProps {
  profileName: string;
  subjectAddress: string;
}

export const ProfileTradingSection = ({
  profileName,
  subjectAddress,
}: ProfileTradingSectionProps) => {
  const { wallet, chainId, isConnected, disconnect } = useAuth();
  const queryClient = useQueryClient();
  const [orderSide, setOrderSide] = useState<OrderSide>("buy");
  const [shares, setShares] = useState("");
  const [loading, setLoading] = useState(false);

  const effectiveChainId = chainId ?? chains[0]?.id ?? "56";
  const factory = useMemo(() => ClawFriendContractFactory.getInstance(), []);

  const { data: bnbBalance } = useQuery({
    queryKey: ["bnbBalance", effectiveChainId, wallet?.address ?? ""],
    queryFn: async () =>
      getBalanceForChain(effectiveChainId, wallet?.address as `0x${string}`),
    enabled: !!wallet?.address,
  });

  const { data: sharesBalance } = useQuery({
    queryKey: [
      "sharesBalance",
      effectiveChainId,
      subjectAddress,
      wallet?.address ?? "",
    ],
    queryFn: async () => {
      const contract = factory.createContract(chainId ?? "56", wallet);
      if (!contract || !subjectAddress || !wallet?.address) return null;
      const balance = await contract.sharesBalance(
        subjectAddress,
        wallet.address
      );
      return balance.toString();
    },
    enabled: !!subjectAddress && !!wallet?.address && !!factory.contractAddress,
  });

  const amountBigInt = useMemo(() => {
    const n = Math.floor(parseFloat(shares || "0") || 0);
    return n > 0 ? BigInt(n) : BigInt(1);
  }, [shares]);

  const { data: buyPriceData } = useQuery({
    queryKey: ["buyPrice", effectiveChainId, subjectAddress, shares],
    queryFn: async () => {
      const contract = factory.createContract(chainId ?? "56", wallet);
      if (!contract || !subjectAddress) return null;
      const [price, priceAfterFee] = await Promise.all([
        contract.getBuyPrice(subjectAddress, amountBigInt),
        contract.getBuyPriceAfterFee(subjectAddress, amountBigInt),
      ]);
      return {
        price: formatEther(price),
        priceAfterFee: formatEther(priceAfterFee),
      };
    },
    enabled:
      !!subjectAddress &&
      !!factory.contractAddress &&
      orderSide === "buy" &&
      (shares ? !isNaN(Number(shares)) && Number(shares) > 0 : true),
  });

  const { data: sellPriceData } = useQuery({
    queryKey: ["sellPrice", effectiveChainId, subjectAddress, shares],
    queryFn: async () => {
      const contract = factory.createContract(chainId ?? "56", wallet);
      if (!contract || !subjectAddress) return null;
      const [price, priceAfterFee] = await Promise.all([
        contract.getSellPrice(subjectAddress, amountBigInt),
        contract.getSellPriceAfterFee(subjectAddress, amountBigInt),
      ]);
      return {
        price: formatEther(price),
        priceAfterFee: formatEther(priceAfterFee),
      };
    },
    enabled:
      !!subjectAddress &&
      !!factory.contractAddress &&
      orderSide === "sell" &&
      (shares ? !isNaN(Number(shares)) && Number(shares) > 0 : true),
  });

  const priceData = orderSide === "buy" ? buyPriceData : sellPriceData;
  const bnbBalanceNum = bnbBalance != null ? parseFloat(bnbBalance) : 0;
  const sharesBalanceNum =
    sharesBalance != null ? parseInt(sharesBalance, 10) : 0;

  const handleBuy = async () => {
    const contract = factory.createContract(chainId ?? "56", wallet);
    if (!contract || !subjectAddress || !shares) {
      toast.error("Subject and amount required");
      return;
    }
    if (!isConnected || !wallet) {
      toast.error("Connect wallet to buy shares");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.buyShares({
        sharesSubject: subjectAddress,
        amount: shares,
      });
      toast.success(`Tx sent: ${tx.txHash}`);
      await tx.wait();
      toast.success("Tx confirmed");
      setShares("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bnbBalance"] }),
        queryClient.invalidateQueries({ queryKey: ["sharesBalance"] }),
      ]);
    } catch (e: unknown) {
      toast.error((e as Error)?.message ?? "Buy failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    const contract = factory.createContract(chainId ?? "56", wallet);
    if (!contract || !subjectAddress || !shares) {
      toast.error("Subject and amount required");
      return;
    }
    if (!isConnected || !wallet) {
      toast.error("Connect wallet to sell shares");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.sellShares({
        sharesSubject: subjectAddress,
        amount: shares,
      });
      toast.success(`Tx sent: ${tx.txHash}`);
      await tx.wait();
      toast.success("Tx confirmed");
      setShares("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bnbBalance"] }),
        queryClient.invalidateQueries({ queryKey: ["sharesBalance"] }),
      ]);
    } catch (e: unknown) {
      toast.error((e as Error)?.message ?? "Sell failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTrade = () => {
    if (orderSide === "buy") handleBuy();
    else handleSell();
  };

  return (
    <div className="flex flex-col pb-8">
      <ProfileSidebarSectionHeader title="Trading" />
      <div className="relative flex flex-col gap-4 p-4">
        <OrderSideToggle orderSide={orderSide} onChange={setOrderSide} />

        {/* Shares input with quick amounts, total, balance */}
        <ProfileSharesInput
          orderSide={orderSide}
          shares={shares}
          onChange={setShares}
          bnbBalance={bnbBalanceNum}
          sharesBalance={sharesBalanceNum}
          price={priceData?.price}
          priceAfterFee={priceData?.priceAfterFee}
          isConnected={!!isConnected}
        />

        {/* Trade button or Connect Wallet */}
        <div className="flex flex-col gap-3 pt-1">
          {!isConnected ? (
            <WalletModal>
              <Button
                variant="primary"
                buttonType="filled"
                size="lg"
                className="w-full text-label-sm font-semibold rounded border-[4px] border-transparent transition-all duration-200 hover:shadow-md active:scale-[0.98]"
              >
                Connect Wallet
              </Button>
            </WalletModal>
          ) : (
            <>
              <Button
                variant="primary"
                buttonType="filled"
                size="lg"
                className="w-full text-label-sm font-semibold rounded border-[4px] border-transparent transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
                disabled={
                  loading ||
                  !shares ||
                  parseFloat(shares) <= 0 ||
                  (orderSide === "buy" &&
                    priceData?.priceAfterFee != null &&
                    parseFloat(priceData.priceAfterFee) > bnbBalanceNum) ||
                  (orderSide === "sell" &&
                    parseInt(shares, 10) > sharesBalanceNum)
                }
                onClick={handleTrade}
              >
                {loading
                  ? "Processing..."
                  : `${orderSide === "buy" ? "Buy" : "Sell"} ${
                      shares ? `${shares} shares` : "shares"
                    } - ${profileName}`}
              </Button>
              <p className="text-label-xs text-neutral-tertiary text-center">
                Wrong wallet?{" "}
                <button
                  type="button"
                  onClick={() => disconnect()}
                  className="text-primary  hover:underline transition-colors"
                >
                  Switch wallet
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
