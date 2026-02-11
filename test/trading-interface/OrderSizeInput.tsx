"use client";

import { AddCircleFill } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";
import { OrderSide, OrderType } from "@/lib/prediction-market/types";
import { useModalStore } from "@/stores/modal.store";
import { useOrderFormStore } from "@/stores/order-form.store";
import { useOutcomeStore } from "@/stores/outcome.store";
import { formatNumberShort } from "@/utils/formatNumberView/number";
import { formatSmartNumberView } from "@/utils/number";
import { memo, useMemo, useRef, useState } from "react";
import { OrderSizeInputProps } from "../../types";

// Helper function to format number for display
// Always use "," as group separator and "." as decimal separator
const formatNumberForDisplay = (
  value: string | undefined,
  locale: string
): string => {
  if (!value || value === "") return "";

  const numValue = parseFloat(value);
  if (isNaN(numValue)) return value;

  // Handle negative numbers
  const isNegative = numValue < 0;
  const absValue = Math.abs(numValue);

  // Format with grouping: always use "," for thousands and "." for decimal
  const parts = absValue.toString().split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Add comma separators to integer part (every 3 digits from right)
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Combine with decimal part if exists
  const formatted =
    decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;

  return isNegative ? `-${formatted}` : formatted;
};

// Helper function to parse localized number string back to plain number string
// Always treat "," as group separator and "." as decimal separator
const parseLocalizedNumber = (value: string, locale: string): string => {
  if (!value || value === "") return "";

  let cleaned = value;

  // Always remove commas (group separator)
  cleaned = cleaned.replace(/,/g, "");

  // Only allow digits, dot, and minus sign
  cleaned = cleaned.replace(/[^\d.-]/g, "");

  // Ensure only one dot (decimal separator)
  const dotIndex = cleaned.indexOf(".");
  if (dotIndex !== -1) {
    cleaned =
      cleaned.substring(0, dotIndex + 1) +
      cleaned.substring(dotIndex + 1).replace(/\./g, "");
  }

  return cleaned;
};

const OrderSizeInput = ({
  totalBalance,
  positionsDataByMarket,
  onChange,
  amountWithinBalance,
  limitOrderWithinBalance,
  quantityWithinTokenLimit,
  limitOrderWithinTokenLimit,
  outcomes,
  currentPrice,
  meetsMinimumTradeSize,
  meetsMinimumShare,
}: OrderSizeInputProps) => {
  const { t, locale } = useTranslation();
  const { toggleDepositModal } = useModalStore();
  const { currentTokenId } = useOutcomeStore();
  const [typingValue, setTypingValue] = useState<string | null>(null);
  const orderForm = useOrderFormStore((state) => state.orderForm);

  const { type, side, quantity, price } = orderForm;
  const isBuy = side === OrderSide.BUY;
  const isMarket = type === OrderType.MARKET;
  const isLimit = type === OrderType.LIMIT;
  const isSell = side === OrderSide.SELL;

  const displayValue = useMemo(() => {
    if (typingValue !== null) {
      return typingValue;
    }
    if (quantity) {
      return formatNumberForDisplay(quantity, locale);
    }
    return "";
  }, [quantity, locale, typingValue]);

  const quickAmounts = isMarket
    ? ["5", "10", "50", "100"]
    : ["-1000", "-100", "100", "1000"];
  const quickPercentages = ["25", "50", "75"];
  const inputRef = useRef<HTMLInputElement>(null);

  const outcome = outcomes?.find(
    (outcome) => outcome.clobTokenId === currentTokenId
  );
  const outcomeLabel = outcome?.label;

  const formatQuickAmountDisplay = (amount: string) => {
    if (!isLimit) return amount;
    const numValue = parseFloat(amount);
    if (numValue > 0) return `+${formatNumberShort(Math.abs(numValue))}`;
    return `-${formatNumberShort(Math.abs(numValue))}`;
  };

  // Calculate available position size when selling
  const availablePositionSize = useMemo(() => {
    if (
      side !== OrderSide.SELL ||
      !positionsDataByMarket?.positions ||
      !currentTokenId
    ) {
      return null;
    }

    const matchingPosition = positionsDataByMarket.positions.find(
      (position: any) => position.asset === currentTokenId
    );

    return matchingPosition?.size || "0";
  }, [side, positionsDataByMarket, currentTokenId]);

  const estimatedShares = useMemo(() => {
    if (!isMarket || !isBuy || !currentPrice || !quantity) return "";

    return (parseFloat(quantity) / (currentPrice || 0)).toFixed(2);
  }, [isMarket, isBuy, quantity, currentPrice]);

  // Calculate estimated $ amount for LIMIT orders
  const estimatedDollarAmount = useMemo(() => {
    if (
      !isLimit ||
      !quantity ||
      !price ||
      parseFloat(quantity) <= 0 ||
      parseFloat(price) <= 0
    )
      return null;

    const shares = parseFloat(quantity);
    // Price is in cents, convert to dollars
    const priceValueInCents = parseFloat(price);
    const priceValueInDollars = priceValueInCents / 100;
    const dollarAmount = shares * priceValueInDollars;
    return dollarAmount;
  }, [isLimit, quantity, price]);

  // Calculate estimated $ amount that will be received when selling
  const estimatedSellAmount = useMemo(() => {
    if (!isSell || !quantity || parseFloat(quantity) <= 0) return null;

    const shares = parseFloat(quantity);

    if (isMarket) {
      if (!currentPrice || currentPrice <= 0) return null;
      return shares * currentPrice;
    } else {
      // For limit orders, use the limit price
      if (!price || parseFloat(price) <= 0) return null;
      // Price is in cents, convert to dollars
      const priceValueInCents = parseFloat(price);
      const priceValueInDollars = priceValueInCents / 100;
      return shares * priceValueInDollars;
    }
  }, [isSell, isMarket, quantity, price, currentPrice]);

  const label = isSell
    ? `${t("tradingInterface.amount")} (${t("tradingInterface.shares")})`
    : isMarket && isBuy
    ? t("tradingInterface.amount") + " ($)"
    : t("tradingInterface.shares");
  const placeholder = "0.0";

  const handleQuickAmount = (amount: string) => {
    if (isLimit) {
      // For limit orders: add amount to current value
      const currentValue = parseFloat(quantity || "0") || 0;
      const amountValue = parseFloat(amount) || 0;
      const newValue = (currentValue + amountValue).toString();
      onChange(newValue);
    } else {
      // For market orders: replace current value
      onChange(amount);
    }
  };
  const handleQuickPercentage = (percentage: string) => {
    if (isSell && availablePositionSize !== null) {
      const availableSize = parseFloat(availablePositionSize);
      const percentageValue = parseFloat(percentage) / 100;
      const calculatedAmount = (availableSize * percentageValue).toFixed(2);
      onChange(calculatedAmount);
    }
  };
  const handleMaxAmount = () => {
    if (isSell && availablePositionSize !== null) {
      // For sell orders, use available position size
      onChange(availablePositionSize?.toString());
    } else if (isLimit && price && parseFloat(price) > 0) {
      // For LIMIT orders, calculate max shares based on balance and price
      const balance = parseFloat(totalBalance.toString());
      // Price is in cents, convert to dollars
      const priceValueInCents = parseFloat(price);
      const priceValueInDollars = priceValueInCents / 100;
      const maxShares = Math.floor((balance / priceValueInDollars) * 100) / 100; // Round down to 2 decimals

      onChange(maxShares.toString());
    } else {
      // For MARKET orders, use total balance
      onChange(totalBalance.toString());
    }
  };

  // Check if there's insufficient balance using validation states from parent
  const hasInsufficientBalance = useMemo(() => {
    const quantityValue = parseFloat(quantity) || 0;

    if (quantityValue === 0) return false;

    // For market buy orders, check amountWithinBalance
    if (isMarket && isBuy) {
      return !amountWithinBalance;
    }

    // For limit buy orders, check limitOrderWithinBalance
    if (isLimit && isBuy) {
      return !limitOrderWithinBalance;
    }

    // For market sell orders, check quantityWithinTokenLimit
    if (isMarket && isSell) {
      return !quantityWithinTokenLimit;
    }

    // For limit sell orders, check limitOrderWithinTokenLimit
    if (isLimit && isSell) {
      return !limitOrderWithinTokenLimit;
    }

    return false;
  }, [
    quantity,
    isMarket,
    isSell,
    isLimit,
    amountWithinBalance,
    limitOrderWithinBalance,
    quantityWithinTokenLimit,
    limitOrderWithinTokenLimit,
  ]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-2">
        <label className="text-body-xs text-neutral-tertiary flex-1">
          {label}
        </label>
        <div className="flex items-center gap-1">
          {isSell && availablePositionSize !== null ? (
            <>
              <span className="text-body-xs text-neutral-tertiary">
                {t("tradingInterface.available")}
              </span>
              <span className="text-body-xs text-neutral-primary">
                {formatSmartNumberView(availablePositionSize)}{" "}
                {outcomeLabel ?? t("tradingInterface.no")}
              </span>
            </>
          ) : (
            <>
              <span className="text-body-xs text-neutral-tertiary">
                {t("tradingInterface.balance")}
              </span>
              <span className="text-body-xs text-neutral-primary">
                ${formatSmartNumberView(totalBalance)}
              </span>
              <div
                className="cursor-pointer"
                onClick={() => toggleDepositModal(true)}
              >
                <AddCircleFill className="text-primary" />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-px">
        <div className="flex items-center gap-2 bg-neutral-03 rounded-sm  px-3 py-2.5  h-10">
          <div className="flex items-center gap-1 flex-1">
            {isMarket && isBuy && (
              <span className="text-label-sm text-neutral-tertiary">$</span>
            )}
            <Input
              type="text"
              inputMode="decimal"
              className={`bg-transparent flex-1 outline-none text-label-sm p-0 h-5 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                hasInsufficientBalance ||
                !meetsMinimumTradeSize ||
                !meetsMinimumShare
                  ? "text-danger"
                  : ""
              }`}
              placeholder={placeholder}
              value={displayValue}
              ref={inputRef}
              autoFocus={true}
              onFocus={(e) => {
                // Select all text for easy replacement
                e.target.select();
              }}
              onChange={(e) => {
                const inputValue = e.target.value;

                // Parse localized number to plain number (handles both formatted and raw input)
                const parsedValue = parseLocalizedNumber(inputValue, locale);

                // Validate: only allow digits, dot, and minus sign
                if (parsedValue === "" || /^-?\d*\.?\d*$/.test(parsedValue)) {
                  // Format immediately for display and store in typingValue
                  if (parsedValue) {
                    // If value ends with ".", format the integer part and keep the dot
                    if (parsedValue.endsWith(".")) {
                      const integerPart = parsedValue.slice(0, -1);
                      const formattedInteger = integerPart
                        ? formatNumberForDisplay(integerPart, locale)
                        : "";
                      setTypingValue(`${formattedInteger}.`);
                    } else {
                      setTypingValue(
                        formatNumberForDisplay(parsedValue, locale)
                      );
                    }
                  } else {
                    setTypingValue("");
                  }
                  // Call onChange with plain number
                  onChange(parsedValue);
                }
              }}
              onBlur={() => {
                // Clear typingValue when blur so displayValue will be calculated from quantity
                setTypingValue(null);
              }}
            />
          </div>
          <span className="text-label-sm text-neutral-tertiary">
            {isSell ? (
              <>
                {estimatedSellAmount !== null ? (
                  <span className="text-neutral-primary">
                    ~ ${formatSmartNumberView(estimatedSellAmount, 2)}
                  </span>
                ) : (
                  <span>$-</span>
                )}
              </>
            ) : isLimit ? (
              <>
                {estimatedDollarAmount !== null ? (
                  <span className="text-neutral-primary">
                    ~ ${formatSmartNumberView(estimatedDollarAmount, 2)}
                  </span>
                ) : (
                  <span>$-</span>
                )}
              </>
            ) : (
              <>
                {estimatedShares ? (
                  <span className="text-neutral-primary">
                    ~ {formatSmartNumberView(estimatedShares, 2)}{" "}
                  </span>
                ) : (
                  "- "
                )}
                {outcomeLabel ?? t("tradingInterface.no")}
              </>
            )}
          </span>
        </div>
        {isBuy && (
          <div className="flex gap-px">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleQuickAmount(amount)}
                className="flex justify-center items-center gap-2 px-2 py-2 bg-neutral-03 transition-colors flex-1"
              >
                <span className="text-body-xs text-neutral-primary">
                  {isMarket ? `$${amount}` : formatQuickAmountDisplay(amount)}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                handleMaxAmount();
              }}
              className="flex justify-center items-center px-2 py-2 bg-neutral-03 transition-colors flex-1"
            >
              <span className="text-body-xs text-neutral-primary">
                {t("tradingInterface.max")}
              </span>
            </button>
          </div>
        )}
        {isSell && (
          <div className="flex gap-px">
            {quickPercentages.map((percentage) => (
              <button
                key={percentage}
                type="button"
                onClick={() => handleQuickPercentage(percentage)}
                className="flex-1 flex justify-center items-center gap-2 px-2 py-2 bg-neutral-03 transition-colors"
              >
                <span className="text-body-xs text-neutral-primary">
                  {percentage}%
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                handleMaxAmount();
              }}
              className="flex-1 flex justify-center items-center gap-2 px-2 py-2 bg-neutral-03 transition-colors"
            >
              <span className="text-body-xs text-neutral-primary">
                {t("tradingInterface.max")}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(OrderSizeInput);
