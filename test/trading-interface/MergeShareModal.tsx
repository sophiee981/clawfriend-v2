"use client";

import { ArrowRightUpLine, CloseLine } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalHeader,
} from "@/components/ui/modal";
import { usePredictionMarket } from "@/contexts";
import { usePredictionWallet } from "@/contexts/PredictionWalletContext";
import { useIsEventScreen, useRefetch } from "@/hooks";
import { useTranslation } from "@/hooks/useTranslation";
import { PolymarketTradingClient } from "@/lib/prediction-market/polymarket";
import { DEFAULT_CHAIN_ID } from "@/lib/prediction-market/polymarket/config/constants";
import { PlatformType, Position } from "@/lib/prediction-market/types";
import { useMarketSlugStore } from "@/stores/market-slug.store";
import { useModalStore } from "@/stores/modal.store";
import { useWalletFilterStore } from "@/stores/wallet-filter.store";
import { getExplorerUrl } from "@/utils/blockchain";
import { toast } from "@/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

interface MergeShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  positionsDataByMarket: any;
  conditionId?: string;
  onRefetchBalance?: () => void;
}

export const MergeShareModal = ({
  open,
  onOpenChange,
  positionsDataByMarket,
  conditionId,
  onRefetchBalance,
}: MergeShareModalProps) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { tradingClient, tradingClientReady } = usePredictionMarket(
    PlatformType.POLYMARKET
  );
  const toggleEnableTradingModal = useModalStore(
    (state) => state.toggleEnableTradingModal
  );
  const { polymarketTradingWalletAddress } = usePredictionWallet();
  const tradingWalletAddress = polymarketTradingWalletAddress;
  const queryClient = useQueryClient();
  const slug = useMarketSlugStore((state) => state.slug);
  const isEventScreen = useIsEventScreen();
  const { filters: walletFilters } = useWalletFilterStore();
  const marketMode =
    walletFilters.marketMode || (isEventScreen ? "event" : "market");
  const { startRefetch } = useRefetch({
    refetchFn: () => {
      queryClient.invalidateQueries({ queryKey: ["positions", conditionId] });
      queryClient.invalidateQueries({ queryKey: ["openOrders", conditionId] });
      queryClient.invalidateQueries({
        queryKey: ["orderHistory", conditionId],
      });
    },
  });

  // Separate function to invalidate chart trades with retry after 10 seconds
  const invalidateChartTrades = useCallback(() => {
    if (!slug || !tradingWalletAddress) return;

    queryClient.invalidateQueries({
      queryKey: ["myTradesForChart", slug, tradingWalletAddress, marketMode],
    });
    queryClient.invalidateQueries({
      queryKey: ["myTradesForChart", slug, "no-wallet", marketMode],
    });
  }, [slug, tradingWalletAddress, marketMode, queryClient]);

  const availableShares = useMemo(() => {
    if (
      !tradingClientReady ||
      !tradingClient ||
      positionsDataByMarket?.positions?.length <= 1
    ) {
      return 0;
    }
    return Math.min(
      ...(positionsDataByMarket?.positions?.map((p: Position) => p.size) || [])
    );
  }, [positionsDataByMarket]);

  const negativeRisk = useMemo(() => {
    return positionsDataByMarket?.positions?.some(
      (p: Position) => p.negativeRisk
    );
  }, [positionsDataByMarket]);

  const handleMax = () => {
    const numericValue = availableShares.toString();
    setAmount(numericValue);
  };

  // Auto-fill max amount when modal opens
  useEffect(() => {
    if (open && availableShares > 0) {
      setAmount(availableShares.toString());
    } else if (!open) {
      // Reset amount when modal closes
      setAmount("");
    }
  }, [open, availableShares]);

  const handleMerge = useCallback(async () => {
    // Validate client
    if (!tradingWalletAddress) {
      toast.error(t("tradingInterface.errors.noWalletConnected"));
      return;
    }
    if (!tradingClientReady || !tradingClient) {
      toast.error(t("tradingInterface.errors.tradingClientNotReady"));
      return;
    }

    // Check if trading is enabled before placing order
    if (tradingClient && tradingClientReady) {
      try {
        const isEnabled = await tradingClient.isEnableTrading();
        if (!isEnabled) {
          toggleEnableTradingModal(true);
          return;
        }
      } catch (error) {
        console.error("Error checking if trading is enabled:", error);
        // Continue with order placement if check fails
      }
    }

    // Validate amount
    const amountValue = parseFloat(amount);
    if (!amount || amountValue <= 0 || amountValue > availableShares) {
      toast.error(t("tradingInterface.errors.invalidAmount"));
      return;
    }

    // Get conditionId from positions
    if (!conditionId) {
      toast.error(t("tradingInterface.errors.conditionIdNotAvailable"));
      return;
    }

    setIsLoading(true);

    // Show loading toast
    const loadingToastId = toast.loading(
      t("tradingInterface.mergeModal.processing"),
      {
        duration: Infinity,
      }
    );

    try {
      // Type assertion: tradingClient is PolymarketTradingClient when platform is POLYMARKET
      const polymarketClient = tradingClient as PolymarketTradingClient;
      const result = await polymarketClient.merge({
        conditionId,
        amount: amountValue,
        negativeRisk,
      });

      if (result.success) {
        // Dismiss loading toast and show success toast
        toast.dismiss(loadingToastId);

        // Build description with action button if transaction hash is available
        const description = result.transactionHash ? (
          <div className="flex flex-col gap-2">
            <span>
              {t("tradingInterface.mergeModal.toast.success.description")}
            </span>
            <Button
              onClick={() => {
                const explorerUrl = getExplorerUrl(
                  DEFAULT_CHAIN_ID,
                  result.transactionHash!
                );
                window.open(explorerUrl, "_blank", "noopener,noreferrer");
              }}
              size="sm"
              variant="secondary"
              buttonType="outline"
              className="w-fit h-7 text-neutral-primary"
            >
              {t("tradingInterface.orderToast.viewTransaction")}{" "}
              <ArrowRightUpLine className="text-xs" />
            </Button>
          </div>
        ) : (
          t("tradingInterface.mergeModal.toast.success.description")
        );

        toast.success(t("tradingInterface.mergeModal.toast.success.title"), {
          description,
        });

        startRefetch();
        onRefetchBalance?.();

        // Invalidate chart trades after 5 seconds and retry after 10 seconds
        setTimeout(() => {
          invalidateChartTrades();
        }, 5000);
        setTimeout(() => {
          invalidateChartTrades();
        }, 10000);

        queryClient.invalidateQueries({ queryKey: ["polymarketBalance"] });

        // Reset form and close modal
        setAmount("");
        onOpenChange(false);
      } else {
        // Dismiss loading toast and show error
        toast.dismiss(loadingToastId);
        toast.error(t("tradingInterface.mergeModal.toast.error.title"), {
          description: t("tradingInterface.mergeModal.toast.error.description"),
        });
      }
    } catch (error) {
      console.error("Error merging shares:", error);
      // Dismiss loading toast and show error
      toast.dismiss(loadingToastId);

      const errorMessage = (error as Error).message || "";
      if (errorMessage.includes("Unknown issue")) {
        toast.error(t("tradingInterface.mergeModal.toast.error.title"), {
          description: t("tradingInterface.mergeModal.toast.error.description"),
        });
        return;
      }

      toast.error(t("tradingInterface.mergeModal.toast.error.title"), {
        description: t("tradingInterface.mergeModal.toast.error.description"),
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    tradingWalletAddress,
    tradingClient,
    tradingClientReady,
    amount,
    availableShares,
    conditionId,
    positionsDataByMarket,
    queryClient,
    startRefetch,
    onOpenChange,
    negativeRisk,
    onRefetchBalance,
    t,
    invalidateChartTrades,
  ]);

  const isDisabled =
    !amount ||
    parseFloat(amount) <= 0 ||
    parseFloat(amount) > availableShares ||
    positionsDataByMarket?.positions?.length <= 1 ||
    isLoading ||
    !tradingClientReady ||
    !tradingClient;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        className="w-[448px] max-w-[448px] p-0 bg-neutral-02 border border-neutral-02 rounded-sm shadow-[0px_0px_32px_0px_rgba(0,0,0,0.1)] backdrop-blur-[64px] gap-0"
        closeable={false}
      >
        {/* Header */}
        <ModalHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-neutral-03 gap-4 space-y-0 ">
          <div className="w-7 h-7"></div>
          <h2 className="text-label-lg text-center flex-1">
            {t("tradingInterface.mergeModal.title")}
          </h2>
          <ModalClose className="p-1.5 rounded-sm bg-neutral-03 transition-colors">
            <CloseLine className="text-neutral-secondary" />
          </ModalClose>
        </ModalHeader>

        {/* Content */}
        <div className="flex flex-col gap-6 p-6">
          {/* Description */}
          <p className="text-body-sm text-neutral-secondary">
            {t("tradingInterface.mergeModal.description")}
          </p>

          {/* Amount Input Section */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              {/* Label and Balance */}
              <div className="flex items-center justify-between">
                <label className="text-body-xs text-neutral-tertiary">
                  {t("tradingInterface.mergeModal.amount")}
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-body-xs text-neutral-tertiary">
                    {t("tradingInterface.available")}
                  </span>
                  <span className="text-body-xs text-neutral-primary">
                    {availableShares} Shares
                  </span>
                  <button
                    onClick={handleMax}
                    className="text-body-xs text-lime hover:underline"
                  >
                    {t("tradingInterface.max")}
                  </button>
                </div>
              </div>

              {/* Input */}
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-neutral-03 border-0 rounded-sm px-3 py-2.5 h-auto text-label-sm placeholder:text-neutral-tertiary focus:border-0 focus:ring-0"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col gap-5">
            <Button
              variant="secondary"
              buttonType="filled"
              size="lg"
              disabled={isDisabled}
              onClick={handleMerge}
              className="w-full"
            >
              {isLoading
                ? "Merging..."
                : amount && parseFloat(amount) > availableShares
                ? t("tradingInterface.insufficientShares")
                : t("tradingInterface.mergeModal.button")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
