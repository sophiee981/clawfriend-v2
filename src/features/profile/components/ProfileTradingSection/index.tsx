"use client";

import WalletModal from "@/components/layout/WalletModal";
import { Button } from "@/components/ui/button";
import { chains } from "@/configs/wallet.config";
import { ClawFriendContractFactory } from "@/lib/contracts/clawfriend";
import { useAuth } from "@/providers/AuthProvider";
import { formatNumberShort } from "@/utils/number";
import { toast } from "@/utils/toast";
import { formatAddress, getBalanceForChain } from "@/utils/web3";
import { useRouter } from "@bprogress/next/app";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { formatEther } from "viem";
import { ProfileSidebarSectionHeader } from "../ProfileSidebarSectionHeader";
import { OrderSideToggle } from "./OrderSideToggle";
import { ProfileSharesInput } from "./ProfileSharesInput";
import TransferSharesSection, {
  type TransferFormData,
} from "./TransferShareSection";

type OrderSide = "buy" | "sell" | "transfer";

interface ProfileTradingSectionProps {
  profileName: string;
  subjectAddress: string;
}

export const ProfileTradingSection = ({
  profileName,
  subjectAddress,
}: ProfileTradingSectionProps) => {
  const { wallet, chainId, isConnected, disconnect } = useAuth();
  const router = useRouter();
  const [orderSide, setOrderSide] = useState<OrderSide>("buy");
  const [shares, setShares] = useState("");
  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState<TransferFormData | null>(
    null,
  );
  const queryClient = useQueryClient();

  const effectiveChainId = chainId ?? chains[0]?.id ?? "56";

  const explorerUrl = useMemo(() => {
    return chains[0]?.blockExplorers?.default?.url;
  }, [chains[0]]);

  const factory = useMemo(() => ClawFriendContractFactory.getInstance(), []);

  const { data: bnbBalance, refetch: refetchBnbBalance } = useQuery({
    queryKey: ["bnbBalance", effectiveChainId, wallet?.address ?? ""],
    queryFn: async () =>
      getBalanceForChain(effectiveChainId, wallet?.address as `0x${string}`),
    enabled: !!wallet?.address,
  });

  const { data: sharesBalance, refetch: refetchSharesBalance } = useQuery({
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
        wallet.address,
      );
      return balance.toString();
    },
    enabled: !!subjectAddress && !!wallet?.address && !!factory.contractAddress,
  });

  const amountBigInt = useMemo(() => {
    const n = Math.floor(parseFloat(shares || "0") || 0);
    return n > 0 ? BigInt(n) : BigInt(1);
  }, [shares]);

  const { data: buyPriceData, refetch: refetchBuyPrice } = useQuery({
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

  const { data: sellPriceData, refetch: refetchSellPrice } = useQuery({
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

  const refetch = useCallback(() => {
    refetchBnbBalance();
    refetchSharesBalance();
    refetchBuyPrice();
    refetchSellPrice();

    // Invalidate activities queries 5 times with 3s intervals
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["trades", "activities"] });
      }, i * 3000);
    }
  }, [
    refetchBnbBalance,
    refetchSharesBalance,
    refetchBuyPrice,
    refetchSellPrice,
    queryClient,
  ]);

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
      await tx.wait();
      toast.success("Buy shares successful", {
        description: (
          <>
            <Button
              variant="success"
              buttonType="outline"
              size="sm"
              className="text-label-xs font-semibold h-7 mt-2"
              onClick={() => {
                window.open(`${explorerUrl}/tx/${tx.txHash}`, "_blank");
              }}
            >
              View Transaction
            </Button>
          </>
        ),
      });
      setShares("");
      refetch();
    } catch (e: any) {
      if (e.message.includes("rejected")) {
        toast.error("User rejected the transaction!");
        return;
      }

      toast.error(e?.message ?? "Buy failed");
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
      await tx.wait();
      toast.success("Sell shares successful", {
        description: (
          <>
            <Button
              variant="success"
              buttonType="outline"
              size="sm"
              className="text-label-xs font-semibold h-7 mt-2"
              onClick={() => {
                window.open(`${explorerUrl}/tx/${tx.txHash}`, "_blank");
              }}
            >
              View Transaction
            </Button>
          </>
        ),
      });
      setShares("");
      refetch();
    } catch (e: any) {
      if (e.message.includes("rejected")) {
        toast.error("User rejected the transaction!");
        return;
      }

      toast.error(e?.message ?? "Sell failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = useCallback(async () => {
    if (
      !transferData?.isValid ||
      !transferData.recipientAddress ||
      !transferData.amount ||
      !transferData.subjectAddress
    ) {
      toast.error("Invalid transfer data");
      return;
    }
    if (!isConnected || !wallet) {
      toast.error("Connect wallet to transfer");
      return;
    }
    setLoading(true);
    try {
      const contract = factory.createContract(chainId ?? "56", wallet);
      if (!contract || !transferData.subjectAddress) {
        toast.error("Contract not available");
        return;
      }
      const tx = await contract.transferShares({
        sharesSubject: transferData.subjectAddress,
        to: transferData.recipientAddress,
        amount: transferData.amount,
      });
      await tx.wait();
      toast.success("Transfer shares successful", {
        description: (
          <>
            <Button
              variant="success"
              buttonType="outline"
              size="sm"
              className="text-label-xs font-semibold h-7 mt-2"
              onClick={() => {
                window.open(`${explorerUrl}/tx/${tx.txHash}`, "_blank");
              }}
            >
              View Transaction
            </Button>
          </>
        ),
      });
      setTransferData(null);
      refetch();
    } catch (e: any) {
      if (e.message.includes("rejected")) {
        toast.error("User rejected the transaction!");
        return;
      }

      toast.error(e?.message ?? "Transfer failed");
    } finally {
      setLoading(false);
    }
  }, [
    transferData,
    isConnected,
    wallet,
    chainId,
    factory,
    explorerUrl,
    refetch,
  ]);

  const handleTrade = () => {
    if (orderSide === "buy") handleBuy();
    else if (orderSide === "sell") handleSell();
    else if (orderSide === "transfer") handleTransfer();
  };

  return (
    <div className="flex flex-col pb-6 border-b border-neutral-03">
      <ProfileSidebarSectionHeader title={`Trading ${profileName}'s share`} />
      <div className="relative flex flex-col gap-4 p-4">
        <OrderSideToggle orderSide={orderSide} onChange={setOrderSide} />

        {orderSide === "transfer" ? (
          <TransferSharesSection
            subjectAddress={subjectAddress}
            profileName={profileName}
            sharesBalance={sharesBalanceNum}
            transferData={transferData}
            onTransferDataChange={setTransferData}
          />
        ) : (
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
        )}

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
                className="w-full text-label-sm font-semibold rounded border-[4px] border-transparent transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100 line-clamp-1"
                disabled={
                  loading ||
                  (orderSide === "transfer"
                    ? !transferData?.isValid
                    : !shares ||
                      parseFloat(shares) <= 0 ||
                      (orderSide === "buy" &&
                        priceData?.priceAfterFee != null &&
                        parseFloat(priceData.priceAfterFee) > bnbBalanceNum) ||
                      (orderSide === "sell" &&
                        parseInt(shares, 10) > sharesBalanceNum))
                }
                onClick={handleTrade}
              >
                {loading
                  ? "Processing..."
                  : `${
                      orderSide === "buy"
                        ? "Buy"
                        : orderSide === "sell"
                          ? "Sell"
                          : "Transfer"
                    } ${
                      orderSide === "transfer"
                        ? transferData?.amount
                          ? `${transferData.amount} shares`
                          : ""
                        : shares
                          ? `${shares} shares`
                          : ""
                    }`}
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

        {/* Wallet Information Box */}
        {isConnected && wallet?.address && (
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between p-3 bg-neutral-02 rounded-lg border border-neutral-03">
              <div className="flex flex-col gap-1">
                <span className="text-label-xs text-neutral-tertiary">
                  Wallet
                </span>
                <span className="text-body-xs text-neutral-primary font-medium">
                  {formatAddress(wallet.address, 6)} •{" "}
                  {bnbBalance != null
                    ? formatNumberShort(parseFloat(bnbBalance))
                    : "0"}{" "}
                  BNB
                </span>
              </div>
              <Button
                variant="primary"
                buttonType="outline"
                size="sm"
                className="text-label-xs font-semibold"
                onClick={() => {
                  router.push(`/wallet/${wallet.address}`, {
                    showProgress: true,
                  });
                }}
              >
                Detail
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
