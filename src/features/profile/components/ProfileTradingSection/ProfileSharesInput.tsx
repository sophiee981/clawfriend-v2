"use client";

import { Input } from "@/components/ui/input";
import { formatNumberShort } from "@/utils/number";

type OrderSide = "buy" | "sell";

interface ProfileSharesInputProps {
  orderSide: OrderSide;
  shares: string;
  onChange: (value: string) => void;
  totalBalance: number;
  pricePerShare: number;
}

export const ProfileSharesInput = ({
  orderSide,
  shares,
  onChange,
  totalBalance = 0,
  pricePerShare = 0.5,
}: ProfileSharesInputProps) => {
  const sharesValue = parseFloat(shares || "0") || 0;
  const totalAmount = sharesValue * pricePerShare;

  const handleQuickShare = (value: string) => {
    if (value === "Max") {
      const maxShares = totalBalance > 0 ? Math.floor(totalBalance / pricePerShare) : 0;
      onChange(maxShares.toString());
    } else {
      onChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Balance row */}
      <div className="flex items-center justify-between px-1">
        <label className="text-body-xs font-medium text-neutral-tertiary">Shares</label>
        <div className="flex items-center gap-1.5">
          <span className="text-body-xs text-neutral-tertiary">Balance</span>
          <span className="text-body-xs font-semibold text-neutral-primary">
            ${formatNumberShort(totalBalance)}
          </span>
        </div>
      </div>

      {/* Shares input */}
      <div className="flex items-stretch rounded-lg border-[4px] border-neutral-03 bg-neutral-02 overflow-hidden transition-all duration-200 focus-within:border-primary/30 focus-within:shadow-sm">
        <Input
          type="text"
          inputMode="decimal"
          className="flex-1 min-w-0 bg-transparent border-0 rounded-none text-label-lg font-semibold py-4 !px-5 h-12 placeholder:text-neutral-tertiary placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 transition-all duration-200"
          placeholder="0"
          value={shares}
          onChange={(e) => {
            const v = e.target.value.replace(",", ".");
            if (v === "" || /^\d*\.?\d*$/.test(v)) onChange(v);
          }}
        />
        <div className="flex items-center px-4">
          <span className="text-body-xs text-neutral-tertiary font-normal">shares</span>
        </div>
      </div>

      {/* Total amount */}
      <div className="flex items-center justify-between py-2.5 px-1 border-t border-neutral-03">
        <span className="text-body-xs font-medium text-neutral-tertiary">Total</span>
        <span className="text-label-md font-semibold text-neutral-primary">
          {totalAmount > 0 ? `$${formatNumberShort(totalAmount)}` : "-"}
        </span>
      </div>
    </div>
  );
};
