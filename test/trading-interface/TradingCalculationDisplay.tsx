"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOrderBook, usePredictionMarket, useTooltip } from "@/hooks";
import { useTradingCalculation } from "@/hooks/useTradingCalculation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  OrderSide,
  OrderType,
  PlatformType,
} from "@/lib/prediction-market/types";
import { useOrderFormStore } from "@/stores/order-form.store";
import { useOutcomeStore } from "@/stores/outcome.store";
import { cn } from "@/utils";
import NumberFlow from "@number-flow/react";
import { memo, useMemo } from "react";
import { TradingCalculationDisplayProps } from "../../types";

const TradingCalculationDisplay = ({
  amountWithinBalance,
  limitOrderWithinBalance,
  quantityWithinTokenLimit,
  limitOrderWithinTokenLimit,
  meetsMinimumTradeSize,
  meetsMinimumShare,
  currentPrice,
}: TradingCalculationDisplayProps) => {
  const { t } = useTranslation();
  const { getTooltip, tooltipKeys } = useTooltip();
  const { tradingClient } = usePredictionMarket(PlatformType.POLYMARKET);
  const currentTokenId = useOutcomeStore((state) => state.currentTokenId);
  const { orderForm } = useOrderFormStore();
  const tradeType = orderForm.type;
  const orderSide = orderForm.side;
  const isBuy = orderSide === OrderSide.BUY;
  const isSell = orderSide === OrderSide.SELL;
  const isMarket = tradeType === OrderType.MARKET;
  const isLimit = tradeType === OrderType.LIMIT;

  const { data: orderbook } = useOrderBook({
    tokenId: currentTokenId,
    enableWebSocket: false,
  });

  const limitPriceInCents = orderForm.price ? parseFloat(orderForm.price) : 0;

  const calculationResult = useTradingCalculation({
    tradingClient,
    orderType: tradeType,
    activeAction: orderSide,
    amount: isMarket && isBuy ? orderForm.quantity || "0" : "0",
    shares: isLimit || (isMarket && isSell) ? orderForm.quantity || "0" : "0",
    limitPrice: limitPriceInCents.toString(),
    slippageTolerance: "2",
    orderbook: tradeType === OrderType.MARKET ? orderbook : undefined,
    priceCurrent: currentPrice,
  });

  // Calculate values for display
  const amountValue = parseFloat(orderForm.quantity || "0");
  const sharesValue = parseFloat(orderForm.quantity || "0");
  const toWinValue = parseFloat(
    orderSide === OrderSide.BUY
      ? calculationResult?.totalWin || "0"
      : calculationResult?.youllReceive || "0"
  );
  const avgPriceValue = parseFloat(calculationResult?.avgPrice || "0");

  // Check invalid balance based on tradeType and orderSide
  const invalidBalance = useMemo(() => {
    // For market buy orders, check amountWithinBalance and minimum trade size
    if (isMarket && isBuy) {
      return !amountWithinBalance || !meetsMinimumTradeSize;
    }

    // For limit buy orders, check limitOrderWithinBalance and minimum share
    if (isLimit && isBuy) {
      return !limitOrderWithinBalance || !meetsMinimumShare;
    }

    // For market sell orders, check quantityWithinTokenLimit
    if (isMarket && isSell) {
      return !quantityWithinTokenLimit;
    }

    // For limit sell orders, check limitOrderWithinTokenLimit and minimum share
    if (isLimit && isSell) {
      return !limitOrderWithinTokenLimit || !meetsMinimumShare;
    }

    return false;
  }, [
    isMarket,
    isBuy,
    isSell,
    isLimit,
    amountWithinBalance,
    limitOrderWithinBalance,
    quantityWithinTokenLimit,
    limitOrderWithinTokenLimit,
    meetsMinimumTradeSize,
    meetsMinimumShare,
  ]);

  return (
    <div className="flex flex-col gap-3">
      {/* Market Buy: Amount */}
      {isMarket && isBuy && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-body-xs text-neutral-tertiary border-b border-neutral-03 border-dashed cursor-pointer">
                    {t("tradingInterface.amount")}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-body-sm">
                    {getTooltip(tooltipKeys.AMOUNT)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {amountValue > 0 ? (
            <NumberFlow
              className={cn("text-label-xs", { "text-danger": invalidBalance })}
              value={amountValue}
              format={{
                style: "currency",
                currency: "USD",
                trailingZeroDisplay: "stripIfInteger",
              }}
              transformTiming={{
                duration: 500,
                easing: "ease-out",
              }}
            />
          ) : (
            <span className="text-label-xs text-neutral-tertiary">-</span>
          )}
        </div>
      )}

      {/* Market Sell: Shares */}
      {isMarket && isSell && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-body-xs text-neutral-tertiary border-b border-neutral-03 border-dashed cursor-pointer">
                    {t("tradingInterface.shares")}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-body-sm">
                    {getTooltip(tooltipKeys.SHARES)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {sharesValue > 0 ? (
            <NumberFlow
              className={cn("text-label-xs", { "text-danger": invalidBalance })}
              value={sharesValue}
              format={{
                style: "decimal",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }}
              transformTiming={{
                duration: 500,
                easing: "ease-out",
              }}
            />
          ) : (
            <span className="text-label-xs text-neutral-tertiary">-</span>
          )}
        </div>
      )}

      {/* Limit Buy/Sell: Limit Price */}
      {isLimit && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-body-xs text-neutral-tertiary border-b border-neutral-03 border-dashed cursor-pointer">
                    {t("tradingInterface.priceInput.limitPrice")}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-body-sm">
                    {getTooltip(tooltipKeys.PRICE)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {limitPriceInCents > 0 ? (
            <NumberFlow
              className="text-label-xs"
              value={limitPriceInCents}
              format={{
                style: "decimal",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }}
              suffix="¢"
              transformTiming={{
                duration: 500,
                easing: "ease-out",
              }}
            />
          ) : (
            <span className="text-label-xs text-neutral-tertiary">-</span>
          )}
        </div>
      )}

      {/* Limit Buy/Sell: Shares */}
      {isLimit && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-body-xs text-neutral-tertiary border-b border-neutral-03 border-dashed cursor-pointer">
                    {t("tradingInterface.shares")}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-body-sm">
                    {getTooltip(tooltipKeys.SHARES)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {sharesValue > 0 ? (
            <NumberFlow
              className={cn("text-label-xs", { "text-danger": invalidBalance })}
              value={sharesValue}
              format={{
                style: "decimal",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }}
              transformTiming={{
                duration: 500,
                easing: "ease-out",
              }}
            />
          ) : (
            <span className="text-label-xs text-neutral-tertiary">-</span>
          )}
        </div>
      )}

      {/* Market: Avg. Price */}
      {isMarket && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-body-xs text-neutral-tertiary border-b border-neutral-03 border-dashed cursor-pointer">
                    {t("tradingInterface.avgPrice")}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-body-sm">
                    {getTooltip(tooltipKeys.AVG_PRICE)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {avgPriceValue > 0 ? (
            <NumberFlow
              className="text-label-xs"
              value={avgPriceValue * 100}
              format={{
                style: "decimal",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }}
              suffix="¢"
              transformTiming={{
                duration: 500,
                easing: "ease-out",
              }}
            />
          ) : (
            <span className="text-label-xs text-neutral-tertiary">-</span>
          )}
        </div>
      )}

      {/* Buy: To Win / Sell: Receive */}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-body-xs text-neutral-tertiary border-b border-neutral-03 border-dashed cursor-pointer">
                  {isSell
                    ? t("tradingInterface.toReceive")
                    : t("tradingInterface.toWin")}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-body-sm">
                  {isSell
                    ? getTooltip(tooltipKeys.RECEIVE)
                    : getTooltip(tooltipKeys.TO_WIN)}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {toWinValue > 0 ? (
          <span className="text-success">
            <NumberFlow
              className="text-label-xs text-success"
              value={toWinValue}
              format={{
                style: "currency",
                currency: "USD",
                trailingZeroDisplay: "stripIfInteger",
              }}
              prefix="+"
              transformTiming={{
                duration: 500,
                easing: "ease-out",
              }}
            />
          </span>
        ) : (
          <span className="text-label-xs text-neutral-tertiary">-</span>
        )}
      </div>
    </div>
  );
};

export default memo(TradingCalculationDisplay);
