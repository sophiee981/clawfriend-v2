"use client";

import { Button } from "@/components/ui/button";
import { OrderSide } from "@/lib/prediction-market/types";
import { useOrderFormStore } from "@/stores/order-form.store";
import { useOutcomeStore } from "@/stores/outcome.store";
import { cn } from "@/utils";
import { formatNumberShort } from "@/utils/formatNumberView/number";
import { motion } from "framer-motion";
import { YesNoButtonsProps } from "../../types";

export const YesNoButtons = ({
  onChange,
  prices,
  outcomes,
}: YesNoButtonsProps) => {
  const currentTokenId = useOutcomeStore((state) => state.currentTokenId);
  const orderForm = useOrderFormStore((state) => state.orderForm);

  const formatPrice = (price: string | number | undefined): string => {
    if (price === undefined || price === null) return "0.00";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return formatNumberShort(numPrice * 100) ?? "0.00";
  };

  const firstOutcome = outcomes?.[0];
  const secondOutcome = outcomes?.[1];
  const firstTokenId = firstOutcome?.clobTokenId ?? "";
  const secondTokenId = secondOutcome?.clobTokenId ?? "";
  const isFirstPrice = currentTokenId === firstTokenId;
  const isSecondPrice = currentTokenId === secondTokenId;
  const isBuy = orderForm.side === OrderSide.BUY;

  const firstPrice = isBuy
    ? prices[firstTokenId]?.buyPrice
    : prices[firstTokenId]?.sellPrice;
  const secondPrice = isBuy
    ? prices[secondTokenId]?.buyPrice
    : prices[secondTokenId]?.sellPrice;

  return (
    <div className="flex gap-2 w-full">
      <Button
        variant={isFirstPrice ? "success" : "secondary"}
        buttonType={isFirstPrice ? "filled" : "tonal"}
        onClick={() => onChange(firstTokenId)}
        size="lg"
        className={cn("flex-1 gap-1", { "bg-neutral-03": !isFirstPrice })}
      >
        <span className="text-label-sm">{firstOutcome?.label ?? "Yes"}</span>
        <motion.span
          key={firstPrice}
          className="text-label-sm"
          animate={{ opacity: [0.3, 1] }}
          transition={{ duration: 0.5 }}
        >
          {formatPrice(firstPrice ?? 0)}¢
        </motion.span>
      </Button>
      <Button
        variant={isSecondPrice ? "danger" : "secondary"}
        buttonType={isSecondPrice ? "filled" : "tonal"}
        onClick={() => onChange(secondTokenId)}
        size="lg"
        className={cn("flex-1 gap-1", { "bg-neutral-03": !isSecondPrice })}
      >
        <span className="text-label-sm">{secondOutcome?.label ?? "No"}</span>
        <motion.span
          key={secondPrice}
          className="text-label-sm"
          animate={{ opacity: [0.3, 1] }}
          transition={{ duration: 0.5 }}
        >
          {formatPrice(secondPrice ?? 0)}¢
        </motion.span>
      </Button>
    </div>
  );
};
