"use client";

import { ArrowRightUpLine } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { usePredictionMarket } from "@/contexts/PredictionMarketContext";
import { usePredictionWallet } from "@/contexts/PredictionWalletContext";
import { useIsEventScreen, useOrderBookPrices, useRefetch } from "@/hooks";
import useTradingBalance from "@/hooks/useTradingBalance";
import { useTranslation } from "@/hooks/useTranslation";
import type { ICreateOrderHistoryRequest } from "@/interfaces";
import {
  OrderSide,
  OrderType,
  PlaceOrderParams,
  PlatformType,
  Position,
  TimeInForce,
} from "@/lib/prediction-market/types";
import { createOrderHistory } from "@/services";
import { useMarketSlugStore } from "@/stores/market-slug.store";
import { useModalStore } from "@/stores/modal.store";
import { useOrderFormStore } from "@/stores/order-form.store";
import { useOutcomeStore } from "@/stores/outcome.store";
import { useWalletFilterStore } from "@/stores/wallet-filter.store";
import { cn } from "@/utils";
import { getExplorerUrl } from "@/utils/blockchain";
import { toast } from "@/utils/toast";
import { usePrivy } from "@privy-io/react-auth";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { polygon } from "viem/chains";
import { useTradingValidation } from "../../hooks/useTradingValidation";
import { TradingInterfaceProps } from "../../types";
import { convertPriceToDecimal, validatePriceTickSize } from "../../utils";
import { CalculationShareMatching } from "./CalculationShareMatching";
import { ClaimPayoutModal } from "./ClaimPayoutModal";
import { ClosedMarketMask } from "./ClosedMarketMask";
import { EventMask } from "./EventMask";
import OrderSizeInput from "./OrderSizeInput";
import PriceInput from "./PriceInput";
import { SellBelowMarketWarning } from "./SellBelowMarketWarning";
import { SlippageWarning } from "./SlippageWarning";
import TradeTypeToggle from "./TradeTypeToggle";
import TradingCalculationDisplay from "./TradingCalculationDisplay";
import { YesNoButtons } from "./YesNoButtons";

dayjs.extend(utc);

export const TradingInterface = ({
  conditionId,
  outcomes,
  onViewPortfolio,
  marketTitle,
  marketImageUrl,
  providerName,
  orderMinSize,
  orderPriceMinTickSize,
  marketId,
  onViewOpenOrders,
  className,
  negativeRisk,
  shortTitle,
}: TradingInterfaceProps) => {
  const isMountedRef = useRef(false);
  const isEventScreen = useIsEventScreen();
  const { activeWallet, polymarketTradingWalletAddress } =
    usePredictionWallet();
  const tradingWalletAddress = polymarketTradingWalletAddress;
  const { getAccessToken, ready, authenticated } = usePrivy();
  const {
    tradingClient,
    tradingClientReady,
    error: contextError,
  } = usePredictionMarket(PlatformType.POLYMARKET);
  const { totalBalance, refetch } = useTradingBalance();
  const queryClient = useQueryClient();
  const [orderLoading, setOrderLoading] = useState(false);
  const {
    orderForm,
    setOrderForm,
    resetOrderForm,
    updateOrderForm,
    error: orderError,
    setError: setOrderError,
  } = useOrderFormStore();
  const { t } = useTranslation();
  const { currentTokenId, setCurrentTokenId } = useOutcomeStore();
  const toggleEnableTradingModal = useModalStore(
    (state) => state.toggleEnableTradingModal
  );
  const slug = useMarketSlugStore((state) => state.slug);
  const { filters: walletFilters } = useWalletFilterStore();
  const marketMode =
    walletFilters.marketMode || (isEventScreen ? "event" : "market");

  // Get toast message based on order type and side
  const getOrderToastMessage = (
    type: OrderType,
    side: OrderSide,
    status: "success" | "error"
  ) => {
    const orderTypeKey =
      type === OrderType.MARKET
        ? side === OrderSide.BUY
          ? "marketBuy"
          : "marketSell"
        : side === OrderSide.BUY
        ? "limitBuy"
        : "limitSell";

    return {
      title: t(`tradingInterface.orderToast.${orderTypeKey}.${status}.title`),
      description: t(
        `tradingInterface.orderToast.${orderTypeKey}.${status}.description`
      ),
    };
  };

  const { startRefetch } = useRefetch({
    refetchCount: 20,
    refetchFn: () => {
      queryClient.invalidateQueries({ queryKey: ["positions", conditionId] });
      queryClient.invalidateQueries({ queryKey: ["openOrders", conditionId] });
      queryClient.invalidateQueries({ queryKey: ["orderHistory"] });
    },
  });
  const { startRefetch: startRefetchBalance } = useRefetch({
    refetchFn: () => refetch(),
    refetchCount: 3,
    interval: 3,
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

  // Use trading validation hook
  const {
    canInteract,
    positionsDataByMarket,
    amountWithinBalance,
    limitOrderWithinBalance,
    quantityWithinTokenLimit,
    limitOrderWithinTokenLimit,
    meetsMinimumTradeSize,
    meetsMinimumShare,
    validationError,
  } = useTradingValidation({
    tradingClient,
    tradingClientReady,
    activeWallet,
    contextError,
    conditionId,
    orderForm,
    totalBalance,
    orderMinSize,
  });

  const { prices } = useOrderBookPrices(
    currentTokenId,
    orderForm.side,
    outcomes
  );

  const currentPrices = useMemo(
    () => ({
      buyPrice: prices[currentTokenId]?.buyPrice || 0,
      sellPrice: prices[currentTokenId]?.sellPrice || 0,
    }),
    [currentTokenId, prices]
  );

  const currentPrice = useMemo(
    () =>
      orderForm.side === OrderSide.BUY
        ? currentPrices.buyPrice
        : currentPrices.sellPrice,
    [orderForm.side, currentPrices]
  );

  // Check if selling below market price (for SELL limit orders)
  const showSellBelowMarketWarning = useMemo(() => {
    if (
      orderForm.type !== OrderType.LIMIT ||
      orderForm.side !== OrderSide.SELL ||
      !orderForm.price ||
      currentPrices.sellPrice <= 0
    ) {
      return false;
    }
    const currentPriceInCents = parseFloat(orderForm.price);
    const bestBidPriceInCents = currentPrices.sellPrice * 100;
    return currentPriceInCents < bestBidPriceInCents;
  }, [orderForm.type, orderForm.side, orderForm.price, currentPrices]);

  const handleTradeSideChange = (tokenId: string) => {
    setOrderError(null);
    const newPrice = prices[tokenId]?.buyPrice || 0;
    const newPriceInCents = (newPrice * 100).toFixed(4).replace(/\.?0+$/, "");

    setOrderForm({ price: newPriceInCents });
    setCurrentTokenId(tokenId);
  };

  useEffect(() => {
    if (typeof window === "undefined" || !outcomes || outcomes.length === 0)
      return;
    const params = new URLSearchParams(window.location.search);
    const outcomeParam = params.get("asset");
    if (outcomeParam) handleTradeSideChange(outcomeParam);
    const timeoutId = setTimeout(() => {
      if (outcomeParam) {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.delete("asset");
        const newSearch = currentParams.toString();
        const newUrl =
          window.location.pathname +
          (newSearch ? `?${newSearch}` : "") +
          window.location.hash;
        window.history.replaceState({}, "", newUrl);
      }
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [outcomes, setOrderForm, setCurrentTokenId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      isMountedRef.current = true;
    }, 0);
    return () => {
      clearTimeout(timeoutId);
      if (isMountedRef.current) {
        resetOrderForm();
        isMountedRef.current = false;
      }
    };
  }, []);

  const handleOrderSideChange = (side: OrderSide) => {
    setOrderError(null);
    setOrderForm({ side, quantity: "" });
  };

  const handleSelectOrderType = (type: OrderType) => {
    setOrderError(null);
    const isMarket = type === OrderType.MARKET;

    setOrderForm({
      type,
      timeInForce: isMarket ? TimeInForce.FAK : TimeInForce.GTC,
      quantity: isMarket ? "" : orderForm.quantity,
    });
  };

  const validateClient = (): string | null => {
    if (!activeWallet?.address || !tradingWalletAddress)
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
  };

  const handlePlaceOrder = useCallback(async () => {
    if (!currentTokenId) {
      setOrderError(t("tradingInterface.errors.tokenIdRequired"));
      return;
    }
    if (orderForm.type === OrderType.LIMIT && orderForm.price) {
      const priceError = validatePriceTickSize(
        orderForm.price,
        orderPriceMinTickSize
      );
      if (priceError) {
        setOrderError(priceError);
        return;
      }
    }

    const error = validateClient();
    if (error) {
      setOrderError(error);
      return;
    }

    // Check if trading is enabled before placing order
    if (tradingClient && tradingClientReady && authenticated) {
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

    setOrderLoading(true);
    setOrderError(null);

    // Show loading toast
    const loadingToastId = toast.loading(t("tradingInterface.placingOrder"), {
      duration: Infinity, // Keep loading until dismissed
    });

    try {
      const orderParams: any = {
        tokenId: currentTokenId,
        marketId: conditionId,
        side: orderForm.side,
        type: orderForm.type,
        quantity: orderForm.quantity,
        timeInForce: orderForm.timeInForce,
      };

      console.log("orderParams", orderParams);

      if (orderForm.type === OrderType.LIMIT && orderForm.price) {
        orderParams.price = convertPriceToDecimal(orderForm.price);
      }

      if (orderForm.timeInForce === TimeInForce.GTD && orderForm.expiresAt) {
        orderParams.expiresAt = new Date(orderForm.expiresAt);
      }

      const result = await tradingClient!.placeOrder(orderParams);

      if (result.success) {
        // Dismiss loading toast and show success toast
        toast.dismiss(loadingToastId);
        const toastMessage = getOrderToastMessage(
          orderForm.type,
          orderForm.side,
          "success"
        );

        const toastOptions: any = {
          description:
            orderForm.type === OrderType.MARKET ? (
              <div className="flex flex-col gap-2">
                {toastMessage.description}
                <Button
                  variant="secondary"
                  buttonType="outline"
                  size="sm"
                  className="w-fit text-neutral-primary h-7"
                  onClick={() => {
                    window.open(
                      getExplorerUrl(polygon.id, result?.transactionHash || ""),
                      "_blank"
                    );
                  }}
                >
                  {t("tradingInterface.orderToast.viewTransaction")}{" "}
                  <ArrowRightUpLine />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {toastMessage.description}
                <Button
                  variant="secondary"
                  buttonType="outline"
                  size="sm"
                  className="w-fit text-neutral-primary h-7"
                  onClick={onViewOpenOrders}
                >
                  {t("tradingInterface.orderToast.viewOpenOrders")}{" "}
                  <ArrowRightUpLine />
                </Button>
              </div>
            ),
        };

        toast.success(toastMessage.title, toastOptions);
        setOrderError(null);
        resetOrderForm(true);
        try {
          if (activeWallet?.address) {
            const accessToken = await getAccessToken();
            if (accessToken) {
              const quantity = parseFloat(orderForm.quantity || "0");
              const isMarket = orderForm.type === OrderType.MARKET;
              const isBuy = orderForm.side === OrderSide.BUY;

              const price =
                isMarket || !orderForm.price
                  ? currentPrice
                  : parseFloat(orderForm.price) / 100;

              const size =
                isMarket && isBuy
                  ? (quantity / (price || 1)).toString()
                  : orderForm.quantity;

              const amount =
                isMarket && isBuy
                  ? orderForm.quantity
                  : (quantity * price).toString();

              const orderHistoryData: ICreateOrderHistoryRequest = {
                side: orderForm.side.toUpperCase() as "BUY" | "SELL",
                size,
                amount,
                price: price.toString(),
                providerTokenId: currentTokenId,
                orderId: result.orderId || "",
                type: isMarket ? "Market" : "Limit",
                marketId: marketId || "",
              };

              await createOrderHistory(
                orderHistoryData,
                activeWallet.address,
                accessToken,
                tradingWalletAddress
              );
            }

            startRefetch();
            startRefetchBalance();
            // Invalidate chart trades after 5 seconds and retry after 10 seconds
            setTimeout(() => {
              invalidateChartTrades();
            }, 5000);
            setTimeout(() => {
              invalidateChartTrades();
            }, 10000);
          }
        } catch (err) {
          console.error("Failed to log order history:", err);
        }
      } else {
        const toastMessage = getOrderToastMessage(
          orderForm.type,
          orderForm.side,
          "error"
        );
        const errorMessage = result.error || toastMessage.description;
        toast.error(toastMessage.title, {
          description: toastMessage.description,
        });
        setOrderError(errorMessage);
      }
    } catch (err) {
      console.log("Error placing order:", err);
      const toastMessage = getOrderToastMessage(
        orderForm.type,
        orderForm.side,
        "error"
      );
      const errorMessage =
        err instanceof Error ? err.message : toastMessage.description;
      toast.error(toastMessage.title, {
        description: toastMessage.description,
      });
      setOrderError(errorMessage);
    } finally {
      toast.dismiss(loadingToastId);
      setOrderLoading(false);
    }
  }, [
    tradingClient,
    tradingClientReady,
    activeWallet,
    orderForm,
    conditionId,
    currentPrice,
    getAccessToken,
    t,
    getOrderToastMessage,
    marketId,
    startRefetch,
    resetOrderForm,
    currentTokenId,
    setOrderError,
    toggleEnableTradingModal,
    authenticated,
    orderPriceMinTickSize,
    validateClient,
    invalidateChartTrades,
  ]);

  const handleUpdateForm = (types: keyof PlaceOrderParams, value: string) => {
    updateOrderForm(types, value);
    if (orderError) {
      setOrderError(null);
    }
  };

  const tradeButtonText = useMemo(() => {
    if (orderLoading) return t("tradingInterface.placingOrder");

    // Show validation error messages first
    if (validationError) return validationError;

    if (!amountWithinBalance || !limitOrderWithinBalance)
      return t("tradingInterface.insufficientBalance");

    if (!quantityWithinTokenLimit || !limitOrderWithinTokenLimit)
      return t("tradingInterface.insufficientShares");

    return orderForm.type === OrderType.MARKET
      ? t("tradingInterface.trade")
      : t("tradingInterface.placeOrder");
  }, [
    orderLoading,
    orderForm.side,
    orderForm.type,
    t,
    amountWithinBalance,
    limitOrderWithinBalance,
    quantityWithinTokenLimit,
    limitOrderWithinTokenLimit,
    validationError,
  ]);

  const canClaim = useMemo(() => {
    return positionsDataByMarket?.positions?.some(
      (p: Position) => p.redeemable && p.percentRealizedPnl > 0
    );
  }, [positionsDataByMarket]);

  const isClaimed = useMemo(() => {
    return positionsDataByMarket?.positions?.some(
      (p: Position) =>
        p.redeemable && p.percentRealizedPnl > 0 && (p.currentValue || 0) === 0
    );
  }, [positionsDataByMarket]);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const winnerOutcomeData = useMemo(() => {
    if (!outcomes || outcomes.length === 0) return undefined;

    const outcomeWithBiggestPrice = outcomes.reduce((prev, current) => {
      const prevPrice = parseFloat(prev?.price || "0");
      const currentPrice = parseFloat(current?.price || "0");
      return currentPrice > prevPrice ? current : prev;
    });

    return outcomeWithBiggestPrice;
  }, [outcomes]);

  const winnerOutcome = winnerOutcomeData?.label;

  const handleOpenClaimModal = useCallback(() => {
    setIsClaimModalOpen(true);
  }, []);

  const handleCloseClaimModal = useCallback(() => {
    setIsClaimModalOpen(false);
  }, []);

  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 p-3 border-b border-neutral-03",
        className
      )}
    >
      {isEventScreen ? (
        <EventMask />
      ) : (
        <ClosedMarketMask
          canClaim={canClaim}
          isClaimed={isClaimed}
          onClaim={canClaim && !isClaimed ? handleOpenClaimModal : undefined}
          onViewPortfolio={onViewPortfolio}
          outcome={winnerOutcome}
          shortTitle={shortTitle}
        />
      )}

      {/* Claim Payout Modal */}
      <ClaimPayoutModal
        isOpen={isClaimModalOpen}
        onClose={handleCloseClaimModal}
        positions={positionsDataByMarket?.positions || []}
        marketTitle={marketTitle}
        marketImageUrl={marketImageUrl}
        providerName={providerName}
        conditionId={conditionId}
        tradingClient={tradingClient}
        tradingClientReady={tradingClientReady}
        activeWallet={tradingWalletAddress}
        contextError={contextError}
        onRefetch={refetch}
        onRefetchBalance={startRefetchBalance}
        outcomes={outcomes || []}
      />
      <TradeTypeToggle
        tradeType={orderForm.type}
        orderSide={orderForm.side}
        onSelectOrderType={handleSelectOrderType}
        onSelectOrderSide={handleOrderSideChange}
        positionsDataByMarket={positionsDataByMarket}
        conditionId={conditionId}
        negativeRisk={negativeRisk}
        onRefetchBalance={startRefetchBalance}
      />

      {/* Yes/No buttons */}
      <YesNoButtons
        onChange={handleTradeSideChange}
        currentTokenId={currentTokenId}
        prices={prices}
        outcomes={outcomes}
      />

      {/* Price input (only for limit orders) */}
      {orderForm.type === OrderType.LIMIT && (
        <PriceInput
          orderSide={orderForm.side}
          price={orderForm.price}
          onChange={(value) => handleUpdateForm("price", value)}
          currentPrice={currentPrice}
          orderPriceMinTickSize={orderPriceMinTickSize}
        />
      )}

      {/* Amount input with quick buttons */}
      <OrderSizeInput
        totalBalance={totalBalance}
        onChange={(value) => handleUpdateForm("quantity", value)}
        positionsDataByMarket={positionsDataByMarket}
        amountWithinBalance={amountWithinBalance}
        limitOrderWithinBalance={limitOrderWithinBalance}
        quantityWithinTokenLimit={quantityWithinTokenLimit}
        limitOrderWithinTokenLimit={limitOrderWithinTokenLimit}
        meetsMinimumTradeSize={meetsMinimumTradeSize}
        meetsMinimumShare={meetsMinimumShare}
        outcomes={outcomes}
        currentPrice={currentPrice}
      />

      {/* Limit order specific options */}
      {/* {orderForm.type === TradeType.LIMIT && (
        <TimeInForceSelect
          options={[
            { value: TimeInForce.GTC, label: "GTC (Good Till Cancel)" },
            { value: TimeInForce.GTD, label: "GTD (Good Till Date)" },
          ]}
          value={orderForm.timeInForce}
          onChange={(value: TimeInForce) =>
            handleUpdateForm("timeInForce", value)
          }
          orderForm={orderForm}
          handleUpdateForm={handleUpdateForm}
        />
      )} */}

      {/* Error message */}
      {orderError && (
        <div className="bg-danger-muted-10 rounded-sm px-4 py-3">
          <p className="text-body-xs text-danger">{orderError}</p>
        </div>
      )}

      {/* Slippage warning message for market orders */}
      <SlippageWarning currentPrice={currentPrice} />

      {/* Warning for selling below market price (for SELL limit orders) */}
      <SellBelowMarketWarning show={showSellBelowMarketWarning} />

      {/* Calculation share matching */}
      {orderForm.type === OrderType.LIMIT && <CalculationShareMatching />}

      {/* Trade button and order details */}
      <div className="flex flex-col gap-3 pb-3 border-b border-neutral-01">
        <Button
          variant="secondary"
          buttonType="filled"
          size="lg"
          className="w-full text-label-sm"
          onClick={handlePlaceOrder}
          disabled={!canInteract || orderLoading || !authenticated || !ready}
        >
          {orderLoading ? t("tradingInterface.placingOrder") : tradeButtonText}
        </Button>

        {/* Order details */}
        <TradingCalculationDisplay
          amountWithinBalance={amountWithinBalance}
          limitOrderWithinBalance={limitOrderWithinBalance}
          quantityWithinTokenLimit={quantityWithinTokenLimit}
          limitOrderWithinTokenLimit={limitOrderWithinTokenLimit}
          meetsMinimumTradeSize={meetsMinimumTradeSize}
          meetsMinimumShare={meetsMinimumShare}
          currentPrice={currentPrice}
        />
      </div>

      {/* Take Profit / Stop Loss checkbox */}
      {/* <TakeProfitStopLoss /> */}
    </div>
  );
};
