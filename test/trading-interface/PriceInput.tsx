"use client";

import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";
import { OrderSide } from "@/lib/prediction-market/types";
import { formatSmartNumberView } from "@/utils/number";
import { memo, useCallback } from "react";
import { PriceInputProps } from "../../types";

const PriceInput = ({
  orderSide = OrderSide.BUY,
  price,
  onChange,
  currentPrice,
  orderPriceMinTickSize,
}: PriceInputProps) => {
  const { t } = useTranslation();

  const formatPriceInCents = (priceValue: number) =>
    formatSmartNumberView(priceValue, 1);

  const displayValue = price || "";

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Normalize comma to dot for decimal separator
      const normalizedValue = e.target.value.replace(",", ".");

      if (normalizedValue === "") {
        onChange("");
        return;
      }

      if (!/^\d*\.?\d*$/.test(normalizedValue)) {
        return;
      }

      if (normalizedValue.endsWith(".") && normalizedValue.match(/^\d+\.$/)) {
        onChange(normalizedValue);
        return;
      }

      const centsValue = parseFloat(normalizedValue);
      if (isNaN(centsValue)) {
        return;
      }

      onChange(centsValue.toString());
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Title section */}
      <div className="flex items-center justify-between">
        <label className="text-body-xs text-neutral-tertiary">
          {t("tradingInterface.priceInput.limitPrice")}
        </label>
        <div className="flex items-center gap-1">
          <span className="text-body-xs text-neutral-tertiary">
            {orderSide === OrderSide.BUY
              ? t("tradingInterface.priceInput.bestAsk")
              : t("tradingInterface.priceInput.bestBid")}
          </span>
          <span className="text-body-xs text-neutral-primary">
            {formatPriceInCents(currentPrice * 100)}¢
          </span>
        </div>
      </div>

      {/* Input section with step controls */}
      <div className="flex items-center gap-1">
        {/* Main input */}
        <div className="flex items-center gap-1 flex-1 px-3 py-2.5 bg-neutral-03 rounded-sm h-10">
          <span className="text-label-sm text-neutral-tertiary">¢</span>
          <Input
            type="text"
            inputMode="decimal"
            lang="en"
            className="bg-transparent flex-1 outline-none text-label-sm p-0 h-5 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="0"
            value={displayValue?.replace(",", ".") || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(PriceInput);
