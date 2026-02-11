"use client";

import { Button } from "@/components/ui/button";
import { Modal, ModalContent } from "@/components/ui/modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PROVIDER_ICONS } from "@/constants";
import { useIsEventScreen, usePredictionWallet, useTooltip } from "@/hooks";
import { useTranslation } from "@/hooks/useTranslation";
import { IOutcome } from "@/interfaces";
import type { Position } from "@/lib/prediction-market/types";
import { syncUserPositions } from "@/services";
import { useMarketSlugStore } from "@/stores/market-slug.store";
import { useWalletFilterStore } from "@/stores/wallet-filter.store";
import { getRealImagePath, LocalStorageKeys, recallFunction } from "@/utils";
import { formatNumberShort } from "@/utils/formatNumberView/number";
import { toast } from "@/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

interface ClaimPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  positions?: Position[];
  marketTitle?: string;
  marketImageUrl?: string;
  providerName?: string;
  providerIconUrl?: string;
  conditionId?: string;
  tradingClient?: any;
  tradingClientReady?: boolean;
  activeWallet?: any;
  contextError?: Error | null;
  outcomes: IOutcome[];
  onRefetch?: () => void;
  onRefetchBalance?: () => void;
}

export const ClaimPayoutModal = ({
  isOpen,
  onClose,
  marketTitle,
  positions,
  marketImageUrl,
  providerName = "Polymarket",
  conditionId,
  tradingClient,
  tradingClientReady,
  contextError,
  outcomes,
  onRefetch,
  onRefetchBalance,
}: ClaimPayoutModalProps) => {
  const { t } = useTranslation();
  const { getTooltip, tooltipKeys } = useTooltip();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const queryClient = useQueryClient();
  const slug = useMarketSlugStore((state) => state.slug);
  const isEventScreen = useIsEventScreen();
  const { filters: walletFilters } = useWalletFilterStore();
  const marketMode =
    walletFilters.marketMode || (isEventScreen ? "event" : "market");
  const { activeWallet } = usePredictionWallet();

  // Separate function to invalidate chart trades with retry after 10 seconds
  const invalidateChartTrades = useCallback(() => {
    if (!slug || !activeWallet?.address) return;

    queryClient.invalidateQueries({
      queryKey: ["myTradesForChart", slug, activeWallet.address, marketMode],
    });
    queryClient.invalidateQueries({
      queryKey: ["myTradesForChart", slug, "no-wallet", marketMode],
    });
  }, [slug, activeWallet?.address, marketMode, queryClient]);

  const redeemablePosition = useMemo(
    () =>
      positions?.find(
        (p: Position) => p.conditionId === conditionId && p.redeemable
      ),
    [positions, conditionId]
  );

  const isClaimed = useMemo(() => {
    const claimedPosition = localStorage.getItem(
      LocalStorageKeys.CLAIMED_POSITION
    );
    return (
      JSON.parse(claimedPosition || "[]") ===
      `${conditionId}-${redeemablePosition?.outcome?.toLowerCase()}`
    );
  }, [conditionId, redeemablePosition]);

  // Get negativeRisk flag and calculate redeem amounts
  const redeemData = useMemo(() => {
    if (!positions || !conditionId) return null;

    // Get all redeemable positions for this condition
    const redeemablePositions = positions.filter(
      (p: Position) => p.conditionId === conditionId && p.redeemable
    );

    if (redeemablePositions.length === 0) return null;

    // Get negativeRisk flag from first redeemable position
    const negativeRisk = redeemablePositions[0].negativeRisk || false;

    const amounts = outcomes.map((o) => {
      const position = redeemablePositions.find((p) => p.outcome === o.label);
      return position ? BigInt(Math.floor(position.size * 1e6)) : BigInt(0);
    });

    return {
      negativeRisk,
      amounts,
    };
  }, [positions, conditionId]);

  // Validate client function
  const validateClient = useCallback((): string | null => {
    if (!activeWallet?.address)
      return t("tradingInterface.errors.noWalletConnected");
    if (!tradingClientReady)
      return t("tradingInterface.errors.tradingClientNotReady");
    if (contextError)
      return t("tradingInterface.errors.clientInitializationError", {
        message: contextError.message,
      });
    if (!tradingClient)
      return t("tradingInterface.errors.tradingClientNotAvailable");
    return null;
  }, [activeWallet, tradingClientReady, contextError, tradingClient, t]);

  // Handle claim function
  const handleClaim = useCallback(async () => {
    if (!conditionId) {
      toast.error(t("tradingInterface.closedMarket.claimError"));
      return;
    }

    const error = validateClient();
    if (error) {
      toast.error(error);
      return;
    }

    setIsLoading(true);

    try {
      const result = await tradingClient!.redeem({
        conditionId: conditionId,
        negativeRisk: redeemData?.negativeRisk,
        amounts: redeemData?.amounts,
      });

      if (result.success) {
        onRefetch?.();
        onRefetchBalance?.();

        const onRefetchPositions = () => {
          queryClient.invalidateQueries({ queryKey: ["positions"] });
          queryClient.invalidateQueries({
            queryKey: ["portfolio-claimable-positions"],
          });
          queryClient.invalidateQueries({
            queryKey: ["portfolio-closed-positions"],
          });
        };

        onRefetchPositions();
        recallFunction(onRefetchPositions, 10, 3);

        if (onRefetchBalance) {
          onRefetchBalance();
          recallFunction(onRefetchBalance, 5, 3);
        }

        // Invalidate chart trades after 5 seconds and retry after 10 seconds
        setTimeout(() => {
          invalidateChartTrades();
        }, 5000);
        setTimeout(() => {
          invalidateChartTrades();
        }, 10000);

        // Sync user positions after successful redeem
        if (activeWallet?.address) {
          syncUserPositions({
            addresses: [activeWallet.address],
            syncAll: false,
            conditionIds: [],
            marketIds: [],
            marketSlugs: [],
            providerTokenIds: [],
          }).catch((error) => {
            console.error("Failed to sync user positions:", error);
            // Don't show error to user, just log it
          });
        }
        localStorage.setItem(
          LocalStorageKeys.CLAIMED_POSITION,
          JSON.stringify(
            `${conditionId}-${redeemablePosition?.outcome?.toLowerCase()}`
          )
        );
        setIsSuccess(true);
      } else {
        setIsError(true);
      }
    } catch (err) {
      console.log("Error claiming payout:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [
    conditionId,
    validateClient,
    tradingClient,
    t,
    onRefetch,
    onRefetchBalance,
    onClose,
    positions,
    redeemData,
    queryClient,
    invalidateChartTrades,
  ]);

  // Calculate payout and position data from redeemablePosition
  const payoutData = useMemo(() => {
    if (!redeemablePosition) {
      return { payout: 0, stake: 0, pnl: 0, pnlPercent: 0, outcome: "" };
    }

    const payout = redeemablePosition.currentValue || 0;
    const stake = redeemablePosition.initialValue || 0;
    const pnl = redeemablePosition.cashPnl || 0;
    const pnlPercent = stake > 0 ? (pnl / stake) * 100 : 0;
    const outcome = redeemablePosition.outcome || "";

    return { payout, stake, pnl, pnlPercent, outcome };
  }, [redeemablePosition]);

  const formatPercent = (value: number) =>
    `${value >= 0 ? "+" : "-"}${Math.abs(value).toFixed(1)}%`;

  // Handle modal close - prevent closing when loading
  const handleClose = useCallback(() => {
    if (isLoading) {
      return; // Prevent closing when loading
    }
    onClose();
  }, [isLoading, onClose]);

  useEffect(() => {
    if (isClaimed) {
      setIsSuccess(true);
    }
  }, [isClaimed]);

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent
        className="w-full max-w-[448px] p-0 border border-neutral-02 bg-neutral-02 overflow-hidden"
        closeable={!isLoading}
      >
        {isSuccess ? (
          <ClaimDoneView payoutData={payoutData} onClose={onClose} />
        ) : (
          <div className="flex flex-col items-center px-6 pt-12 pb-6">
            {/* Title Section with Mascot */}
            <div className="flex flex-col items-center gap-3 w-full pb-6">
              {/* Mascot Image */}
              <div className="flex items-center justify-center pb-2">
                <Image
                  src={getRealImagePath("/images/claim-mascot.svg")}
                  alt="Celebration mascot"
                  width={96}
                  height={96}
                  className="w-24 h-24"
                  sizes="96px"
                />
              </div>

              {/* Title */}
              <div className="flex flex-col items-center gap-2 px-6">
                <h2 className="text-heading-md text-neutral-primary text-center">
                  {t("tradingInterface.claimPayoutModal.title", {
                    amount: `$${formatNumberShort(payoutData.payout, {
                      useShorterExpression: true,
                    })}`,
                  })}
                </h2>
              </div>
            </div>

            {/* Market Information Section */}
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              {/* Market Card */}
              <div className="flex flex-col justify-center gap-4 p-6 w-full border border-neutral-02 rounded-sm">
                {/* Event Title Row */}
                <div className="flex items-center gap-3 pb-4 border-b border-neutral-02">
                  {/* Market Image */}
                  {marketImageUrl && (
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full border border-overlay-light-10 overflow-hidden bg-neutral-02">
                        <Image
                          src={marketImageUrl}
                          alt={marketTitle || ""}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover w-10 h-10"
                          sizes="40px"
                        />
                      </div>
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-neutral-inverse rounded-full border border-overlay-light-10 flex items-center justify-center overflow-hidden">
                        {PROVIDER_ICONS[
                          providerName.toUpperCase() as keyof typeof PROVIDER_ICONS
                        ] ? (
                          <Image
                            src={
                              PROVIDER_ICONS[
                                providerName.toUpperCase() as keyof typeof PROVIDER_ICONS
                              ]
                            }
                            alt={providerName}
                            width={16}
                            height={16}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-02" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                    <h3 className="text-label-sm text-neutral-primary line-clamp-2">
                      {marketTitle ||
                        t(
                          "tradingInterface.claimPayoutModal.marketTitlePlaceholder"
                        )}
                    </h3>
                  </div>
                </div>

                {/* Market Info Items */}
                <div className="flex flex-col gap-2 pb-4 border-b border-neutral-02">
                  {/* Outcome */}
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-body-sm text-neutral-secondary cursor-pointer border-b border-dashed border-neutral-03 w-fit">
                              {t("tradingInterface.claimPayoutModal.outcome")}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-body-sm">
                              {getTooltip(tooltipKeys.OUTCOME)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-body-sm text-neutral-primary capitalize">
                        {payoutData.outcome || "—"}
                      </span>
                    </div>
                  </div>

                  {/* Stake */}
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-body-sm text-neutral-secondary cursor-pointer border-b border-dashed border-neutral-03 w-fit">
                              {t("tradingInterface.claimPayoutModal.stake")}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-body-sm">
                              {getTooltip(tooltipKeys.STAKE)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-body-sm text-neutral-primary">
                        $
                        {formatNumberShort(payoutData.stake, {
                          useShorterExpression: true,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* PnL */}
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-body-sm text-neutral-secondary cursor-pointer border-b border-dashed border-neutral-03 w-fit">
                              {t("tradingInterface.claimPayoutModal.pnl")}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-body-sm">
                              {getTooltip(tooltipKeys.PNL)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-body-sm text-success">
                        $
                        {formatNumberShort(payoutData.pnl, {
                          useShorterExpression: true,
                        })}{" "}
                        ({formatPercent(payoutData.pnlPercent)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Provider */}
                <div className="flex flex-col gap-2 pb-4 border-b border-neutral-02">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-body-sm text-neutral-secondary cursor-pointer border-b border-dashed border-neutral-03 w-fit">
                              {t("tradingInterface.claimPayoutModal.provider")}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-body-sm">
                              {getTooltip(tooltipKeys.PROVIDER)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2 py-0.5 px-0.5">
                      {PROVIDER_ICONS[
                        providerName.toUpperCase() as keyof typeof PROVIDER_ICONS
                      ] ? (
                        <Image
                          src={
                            PROVIDER_ICONS[
                              providerName.toUpperCase() as keyof typeof PROVIDER_ICONS
                            ]
                          }
                          alt={providerName}
                          width={20}
                          height={20}
                          className="h-5 object-contain"
                          sizes="20px"
                        />
                      ) : null}
                      {providerName}
                    </div>
                  </div>
                </div>

                {/* Payout */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-body-sm text-neutral-secondary cursor-pointer border-b border-dashed border-neutral-03 w-fit">
                              {t("tradingInterface.claimPayoutModal.payout")}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-body-sm">
                              {getTooltip(tooltipKeys.PAYOUT)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-label-lg text-success">
                        $
                        {formatNumberShort(payoutData.payout, {
                          useShorterExpression: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Claim Button */}
              <div className="flex flex-col gap-4 w-full">
                {isError && (
                  <div className="text-body-sm text-neutral-secondary text-center">
                    {t("tradingInterface.claimPayoutModal.error")}
                  </div>
                )}
                <Button
                  variant={isError ? "secondary" : "primary"}
                  buttonType="filled"
                  size="lg"
                  className="w-full"
                  onClick={handleClaim}
                  loading={isLoading}
                  disabled={isLoading || payoutData.payout === 0}
                >
                  {isLoading
                    ? t("tradingInterface.claimPayoutModal.processing")
                    : isError
                    ? t("tradingInterface.claimPayoutModal.tryAgain")
                    : t("tradingInterface.claimPayoutModal.claimButton")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

interface PayoutData {
  payout: number;
  stake: number;
  pnl: number;
  pnlPercent: number;
  outcome: string;
}

const ClaimDoneView = memo(
  ({
    payoutData,
    onClose,
  }: {
    payoutData: PayoutData;
    onClose: () => void;
  }) => {
    const { t } = useTranslation();

    return (
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 z-[10] translate-y-[-36%]">
          {/* Gradient overlay */}
          <Image
            src={getRealImagePath("/images/ellipse_18.svg")}
            alt="Success"
            width={446}
            height={92}
            className="w-full h-full"
            sizes="(max-width: 768px) 100vw, 446px"
          />
        </div>
        {/* Animated tokens falling */}
        <div className="absolute inset-0 z-[-1]">
          {/* Token 1 */}
          <Image
            src={getRealImagePath("/images/tokens/token-1.svg")}
            alt="Token"
            width={24}
            height={20}
            className="absolute animate-fall"
            style={{
              left: "3%",
              animationDelay: "0s",
              animationDuration: "2s",
            }}
            sizes="24px"
          />
          {/* Token 2 */}
          <Image
            src={getRealImagePath("/images/tokens/token-2.svg")}
            alt="Token"
            width={15}
            height={12}
            className="absolute animate-fall"
            style={{
              left: "15%",
              animationDelay: "0.3s",
              animationDuration: "2.2s",
            }}
            sizes="15px"
          />
          {/* Token 3 */}
          <Image
            src={getRealImagePath("/images/tokens/token-3.svg")}
            alt="Token"
            width={23}
            height={24}
            className="absolute animate-fall"
            style={{
              left: "35%",
              animationDelay: "0.1s",
              animationDuration: "1.8s",
            }}
            sizes="24px"
          />
          {/* Token 4 */}
          <Image
            src={getRealImagePath("/images/tokens/token-4.svg")}
            alt="Token"
            width={17}
            height={18}
            className="absolute animate-fall"
            style={{
              left: "50%",
              animationDelay: "0.5s",
              animationDuration: "2.3s",
            }}
            sizes="18px"
          />
          {/* Token 5 */}
          <Image
            src={getRealImagePath("/images/tokens/token-5.svg")}
            alt="Token"
            width={23}
            height={24}
            className="absolute animate-fall"
            style={{
              left: "70%",
              animationDelay: "0.2s",
              animationDuration: "2.1s",
            }}
            sizes="24px"
          />
          {/* Token 6 */}
          <Image
            src={getRealImagePath("/images/tokens/token-6.svg")}
            alt="Token"
            width={22}
            height={20}
            className="absolute animate-fall"
            style={{
              left: "85%",
              animationDelay: "0.4s",
              animationDuration: "2.4s",
            }}
            sizes="22px"
          />
          {/* Token 7 */}
          <Image
            src={getRealImagePath("/images/tokens/token-7.svg")}
            alt="Token"
            width={22}
            height={20}
            className="absolute animate-fall"
            style={{
              left: "25%",
              animationDelay: "0.6s",
              animationDuration: "2.5s",
            }}
            sizes="22px"
          />

          <Image
            src={getRealImagePath("/images/redeem-bg.png")}
            alt="Success"
            width={446}
            height={92}
            className="w-full h-full"
            sizes="(max-width: 768px) 100vw, 446px"
          />
        </div>

        {/* Success Content */}
        <div className="relative z-[0] flex flex-col items-center justify-center gap-8 h-full px-8 py-6">
          <div className="flex flex-col items-center gap-8 py-6 px-[30px]">
            {/* Success Icon/Image */}
            <div className="flex items-center justify-center">
              <div className="w-[109px] h-[148px] relative">
                <Image
                  src={getRealImagePath("/images/success-mascot.png")}
                  alt="Success"
                  width={109}
                  height={148}
                  className="w-full h-full"
                  sizes="109px"
                />
              </div>
            </div>

            {/* Success Message */}
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-heading-md whitespace-pre-wrap">
                {t("tradingInterface.claimPayoutModal.success.messagePart1")}
                <span className="text-success">
                  $
                  {formatNumberShort(payoutData.payout, {
                    useShorterExpression: true,
                  })}
                </span>
                {t("tradingInterface.claimPayoutModal.success.messagePart2")}
              </h1>
            </div>
          </div>

          {/* Done Button */}
          <Button
            variant="primary"
            buttonType="filled"
            size="lg"
            className="w-full"
            onClick={onClose}
          >
            {t("tradingInterface.claimPayoutModal.success.doneButton")}
          </Button>
        </div>
      </div>
    );
  },
  // Custom comparison function: always return true to prevent re-renders
  () => true
);
