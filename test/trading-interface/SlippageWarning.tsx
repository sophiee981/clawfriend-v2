"use client";

import { usePredictionMarket } from "@/contexts/PredictionMarketContext";
import { useOrderBook } from "@/hooks/useOrderBook";
import { useTradingCalculation } from "@/hooks/useTradingCalculation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  OrderSide,
  OrderType,
  PlatformType,
} from "@/lib/prediction-market/types";
import { useOrderFormStore } from "@/stores/order-form.store";
import { useOutcomeStore } from "@/stores/outcome.store";
import { useMemo } from "react";

interface SlippageWarningProps {
  currentPrice: number;
}

export const SlippageWarning = ({ currentPrice }: SlippageWarningProps) => {
  const { t } = useTranslation();
  const { orderForm } = useOrderFormStore();
  const currentTokenId = useOutcomeStore((state) => state.currentTokenId);
  const orderType = orderForm.type;
  const orderSide = orderForm.side;
  const quantity = orderForm.quantity;
  const limitPrice = orderForm.price;

  // Get trading client and public client from context
  const { tradingClient } = usePredictionMarket(PlatformType.POLYMARKET);

  const { data: orderbook } = useOrderBook({
    tokenId: currentTokenId,
    enableWebSocket: false,
  });

  // Calculate avgPrice using useTradingCalculation hook
  const limitPriceInCents = limitPrice ? parseFloat(limitPrice) : 0;
  const calculationResult = useTradingCalculation({
    tradingClient,
    orderType,
    activeAction: orderSide,
    amount:
      orderType === OrderType.MARKET && orderSide === OrderSide.BUY
        ? quantity || "0"
        : "0",
    shares:
      orderType === OrderType.LIMIT ||
      (orderType === OrderType.MARKET && orderSide === OrderSide.SELL)
        ? quantity || "0"
        : "0",
    limitPrice: limitPriceInCents.toString(),
    slippageTolerance: "2",
    orderbook: orderType === OrderType.MARKET ? orderbook : undefined,
    priceCurrent: currentPrice,
  });

  const avgPrice = parseFloat(calculationResult?.avgPrice || "0");

  // Calculate slippage percentage for market orders
  const slippagePercentage = useMemo(() => {
    if (
      orderType !== OrderType.MARKET ||
      currentPrice <= 0 ||
      avgPrice <= 0 ||
      !quantity ||
      parseFloat(quantity) <= 0
    ) {
      return 0;
    }

    const difference = Math.abs(avgPrice - currentPrice);
    const percentage = (difference / currentPrice) * 100;
    return percentage;
  }, [orderType, quantity, currentPrice, avgPrice]);

  // Show warning if slippage is >= 5%
  const showSlippageWarning =
    orderType === OrderType.MARKET && slippagePercentage >= 5;

  if (!showSlippageWarning) {
    return null;
  }

  return (
    <div className="bg-warning-muted-10 rounded-sm px-4 py-3">
      <p className="text-body-xs text-warning">
        {t("tradingInterface.slippageWarning", {
          percentage: Math.round(slippagePercentage),
        })}
      </p>
    </div>
  );
};
