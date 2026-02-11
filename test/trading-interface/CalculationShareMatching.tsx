"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOrderBook } from "@/hooks";
import { useTranslation } from "@/hooks/useTranslation";
import { OrderSide } from "@/lib/prediction-market/types";
import { useOrderFormStore } from "@/stores/order-form.store";
import { useOutcomeStore } from "@/stores/outcome.store";
import { formatNumberShort } from "@/utils/formatNumberView/number";
import { useMemo } from "react";

export const CalculationShareMatching = () => {
  const { t } = useTranslation();
  const { orderForm } = useOrderFormStore();
  const currentTokenId = useOutcomeStore((state) => state.currentTokenId);

  const { data: orderbook } = useOrderBook({
    tokenId: currentTokenId,
    enableWebSocket: false,
  });

  const matchingShares = useMemo(() => {
    if (!orderbook || !orderForm.price || !orderForm.quantity) return null;

    const limitPrice = parseFloat(orderForm.price); // Keep in cents
    const requestedShares = parseFloat(orderForm.quantity) || 0;

    if (limitPrice <= 0 || limitPrice > 100 || requestedShares <= 0)
      return null;

    let totalMatchingShares = 0;

    const roundPrice = (price: number) => Math.round(price * 100 * 10) / 10;

    const isBuy = orderForm.side === OrderSide.BUY;
    const list = isBuy ? orderbook.asks : orderbook.bids;
    const listLength = list.length;
    const isMatch = (price: number) =>
      isBuy ? price <= limitPrice : price >= limitPrice;

    for (let i = listLength - 1; i >= 0; i--) {
      const item = list[i];
      const price = roundPrice(Number(item.price));
      if (isMatch(price)) {
        totalMatchingShares += Number(item.size);
      } else {
        break;
      }
    }

    return Math.min(totalMatchingShares, requestedShares);
  }, [orderbook, orderForm.price, orderForm.quantity, orderForm.side]);

  if (!matchingShares || matchingShares <= 0) return null;

  return (
    <Alert variant="success" showIcon={false} showClose={false}>
      <AlertDescription className="text-body-xs text-success text-center w-full">
        {t("tradingInterface.shareMatching", {
          shares: formatNumberShort(matchingShares) || 0,
        })}
      </AlertDescription>
    </Alert>
  );
};
