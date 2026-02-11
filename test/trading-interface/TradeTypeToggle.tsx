"use client";

import { DownLine } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import { OrderSide, OrderType } from "@/lib/prediction-market/types";
import * as SelectPrimitive from "@radix-ui/react-select";
import { memo, useState } from "react";
import { TradeTypeToggleProps } from "../../types";
import { MergeShareModal } from "./MergeShareModal";
import { SplitShareModal } from "./SplitShareModal";

const TradeTypeToggle = ({
  tradeType,
  orderSide,
  onSelectOrderType,
  onSelectOrderSide,
  positionsDataByMarket,
  conditionId,
  negativeRisk,
  onRefetchBalance,
}: TradeTypeToggleProps) => {
  const { t } = useTranslation();
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const handleValueChange = (value: string) => {
    if (value === "split") {
      setSplitModalOpen(true);
      setSelectOpen(false);
      // Don't update the Select value, keep current tradeType
      return;
    } else if (value === "merge") {
      setMergeModalOpen(true);
      setSelectOpen(false);
      // Don't update the Select value, keep current tradeType
      return;
    } else {
      onSelectOrderType(
        value === OrderType.MARKET ? OrderType.MARKET : OrderType.LIMIT
      );
      setSelectOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Buy/Sell Toggle */}
      <div className="flex items-center border border-neutral-03 rounded-sm">
        <Button
          onClick={() => onSelectOrderSide(OrderSide.BUY)}
          variant="secondary"
          buttonType="transparent"
          size="sm"
          className={`rounded-none text-label-xs py-1.5 px-3 h-7 ${orderSide === OrderSide.BUY
            ? "bg-neutral-inverse text-neutral-on-color border-r border-neutral-03"
            : "bg-transparent text-neutral-01"
            }`}
        >
          {t("tradingInterface.buy")}
        </Button>
        <Button
          onClick={() => onSelectOrderSide(OrderSide.SELL)}
          variant="secondary"
          buttonType="transparent"
          size="sm"
          className={`rounded-none text-label-xs py-1.5 px-3 h-7 ${orderSide === OrderSide.SELL
            ? "bg-neutral-inverse text-neutral-on-color"
            : "bg-transparent text-neutral-01"
            }`}
        >
          {t("tradingInterface.sell")}
        </Button>
      </div>

      {/* Market Button with Dropdown */}
      <Select
        value={tradeType}
        open={selectOpen}
        onOpenChange={setSelectOpen}
        onValueChange={handleValueChange}
      >
        <SelectTrigger
          className="h-7 py-1.5 pl-3 pr-1.5 gap-1 rounded-sm bg-neutral-03 text-label-xs w-fit border-0"
          showIcon={false}
        >
          <SelectValue>
            {tradeType === OrderType.MARKET
              ? t("tradingInterface.market")
              : t("tradingInterface.limit")}
          </SelectValue>
          <SelectPrimitive.Icon asChild>
            <DownLine className="text-xs text-neutral-tertiary" />
          </SelectPrimitive.Icon>
        </SelectTrigger>
        <SelectContent className="bg-neutral-04 w-40 rounded-sm shadow-[8px_16px_16px_0px_rgba(0,0,0,0.2)] border-0">
          {/* Section 1: Market and Limit */}
          <div className="flex flex-col gap-1 p-1">
            <SelectItem
              value={OrderType.MARKET}
              className="px-2 py-1 h-auto text-label-xs text-neutral-primary data-[highlighted]:bg-neutral-04 rounded-sm"
            >
              {t("tradingInterface.market")}
            </SelectItem>
            <SelectItem
              value={OrderType.LIMIT}
              className="px-2 py-1 h-auto text-label-xs text-neutral-primary data-[highlighted]:bg-neutral-04 rounded-sm"
            >
              {t("tradingInterface.limit")}
            </SelectItem>
          </div>

          {/* Separator */}
          <div className="border-b border-neutral-04" />

          {/* Section 2: Split and Merge */}
          <div className="flex flex-col gap-1 p-1">
            <SelectItem
              value="split"
              className="px-2 py-1 h-auto text-label-xs text-neutral-primary data-[highlighted]:bg-neutral-04 rounded-sm"
            >
              {t("tradingInterface.split")}
            </SelectItem>
            <SelectItem
              value="merge"
              className="px-2 py-1 h-auto text-label-xs text-neutral-primary data-[highlighted]:bg-neutral-04 rounded-sm"
            >
              {t("tradingInterface.merge")}
            </SelectItem>
          </div>

          {/* Separator */}
          <div className="border-b border-neutral-04" />

          {/* Section 3: Trailing Stop and TWAP */}
          <div className="flex flex-col gap-1 p-1">
            <SelectItem
              value="trailing-stop"
              disabled
              className="px-2 py-1 h-auto text-label-xs text-neutral-primary data-[highlighted]:bg-neutral-04 rounded-sm opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span>{t("tradingInterface.trailingStop")}</span>
                <Badge
                  variant="secondary"
                  type="tonal"
                  size="sm"
                  className="px-1.5 py-1 h-auto rounded-full text-[10px] leading-[12px] font-medium uppercase text-neutral-tertiary bg-neutral-04 border-0"
                >
                  {t("tradingInterface.soon")}
                </Badge>
              </div>
            </SelectItem>
            <SelectItem
              value="twap"
              disabled
              className="px-2 py-1 h-auto text-label-xs text-neutral-primary data-[highlighted]:bg-neutral-04 rounded-sm opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span>{t("tradingInterface.twap")}</span>
                <Badge
                  variant="secondary"
                  type="tonal"
                  size="sm"
                  className="px-1.5 py-1 h-auto rounded-full text-[10px] leading-[12px] font-medium uppercase text-neutral-tertiary bg-neutral-04 border-0"
                >
                  {t("tradingInterface.soon")}
                </Badge>
              </div>
            </SelectItem>
          </div>
        </SelectContent>
      </Select>

      {/* Modals */}
      <SplitShareModal
        open={splitModalOpen}
        onOpenChange={setSplitModalOpen}
        conditionId={conditionId}
        negativeRisk={negativeRisk}
        onRefetchBalance={onRefetchBalance}
      />
      <MergeShareModal
        open={mergeModalOpen}
        onOpenChange={setMergeModalOpen}
        conditionId={conditionId}
        positionsDataByMarket={positionsDataByMarket}
        onRefetchBalance={onRefetchBalance}
      />
    </div>
  );
};

export default memo(TradeTypeToggle);
