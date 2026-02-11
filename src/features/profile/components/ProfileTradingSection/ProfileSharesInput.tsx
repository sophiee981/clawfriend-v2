"use client";

import { ChainPair } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { formatNumberShort } from "@/utils/number";

type OrderSide = "buy" | "sell";

interface ProfileSharesInputProps {
  orderSide: OrderSide;
  shares: string;
  onChange: (value: string) => void;
  bnbBalance: number;
  sharesBalance: number;
  price?: string | null;
  priceAfterFee?: string | null;
  isConnected: boolean;
}

function formatBnb(value: string | number | null | undefined): string {
  if (value == null || value === "") return "-";
  const n = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(n) ? "-" : `${formatNumberShort(n)} BNB`;
}

export const ProfileSharesInput = ({
  orderSide,
  shares,
  onChange,
  bnbBalance = 0,
  sharesBalance = 0,
  price,
  priceAfterFee,
  isConnected,
}: ProfileSharesInputProps) => {
  const sharesValue = parseInt(shares || "0", 10) || 0;
  const priceAfterFeeNum =
    priceAfterFee != null ? parseFloat(priceAfterFee) : 0;
  const priceNum = price != null ? parseFloat(price) : 0;
  const feeNum = Math.abs(priceAfterFeeNum - priceNum);

  const isBuy = orderSide === "buy";
  const balance = isBuy ? bnbBalance : sharesBalance;
  const balanceLabel = isBuy ? "BNB" : "shares";

  const insufficientBalance =
    isConnected &&
    sharesValue > 0 &&
    (isBuy ? priceAfterFeeNum > bnbBalance : sharesValue > sharesBalance);

  const validationError = insufficientBalance
    ? isBuy
      ? "Insufficient BNB balance"
      : "Insufficient shares"
    : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Balance row */}
      <div className="flex items-center justify-between px-1">
        <label className="text-body-xs font-medium text-neutral-tertiary">
          Shares
        </label>
        <div className="flex items-center gap-1.5">
          <span className="text-body-xs text-neutral-tertiary">
            Balance ({balanceLabel})
          </span>
          <span className="text-body-xs font-semibold text-neutral-primary flex items-center gap-1">
            {!isConnected ? (
              "Connect wallet"
            ) : isBuy ? (
              <>
                {formatNumberShort(balance)}
                <ChainPair className="w-3 h-3" />
              </>
            ) : (
              formatNumberShort(balance)
            )}
          </span>
        </div>
      </div>

      {/* Shares input */}
      <div
        className={`flex items-stretch rounded-lg border-[4px] overflow-hidden transition-all duration-200 focus-within:shadow-sm ${
          validationError
            ? "border-danger bg-danger/5 focus-within:border-danger"
            : "border-neutral-03 bg-neutral-02 focus-within:border-primary/30"
        }`}
      >
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="flex-1 min-w-0 bg-transparent border-0 rounded-none text-label-lg font-semibold py-4 !px-5 h-12 placeholder:text-neutral-tertiary placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 transition-all duration-200"
          placeholder="0"
          value={shares}
          onChange={(e) => {
            const v = e.target.value;
            if (/^\d*$/.test(v)) onChange(v);
          }}
        />
        <div className="flex items-center px-4">
          <span className="text-body-xs text-neutral-tertiary font-normal">
            shares
          </span>
        </div>
      </div>

      {/* Validation error */}
      {validationError && (
        <p className="text-body-xs font-medium text-danger px-1">
          {validationError}
        </p>
      )}

      {/* Price breakdown */}
      <div className="flex flex-col gap-2 py-2.5 px-1 border-t border-neutral-03">
        {sharesValue > 0 && (price != null || priceAfterFee != null) && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-body-xs font-medium text-neutral-tertiary">
                Price
              </span>
              <span className="text-body-xs font-medium text-neutral-primary flex items-center gap-1">
                {formatBnb(price)}
                <ChainPair className="w-3 h-3" />
              </span>
            </div>
            {feeNum > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-body-xs font-medium text-neutral-tertiary">
                  Fee
                </span>
                <span className="text-body-xs font-medium text-neutral-primary flex items-center gap-1">
                  {formatBnb(feeNum)}
                  <ChainPair className="w-3 h-3" />
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-body-xs font-medium text-neutral-tertiary">
                {isBuy ? "Total" : "You receive"}
              </span>
              <span className="text-label-md font-semibold text-neutral-primary flex items-center gap-1">
                {formatBnb(priceAfterFee)}
                <ChainPair className="w-3 h-3" />
              </span>
            </div>
          </>
        )}
        {sharesValue <= 0 && (
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-medium text-neutral-tertiary">
              Total
            </span>
            <span className="text-label-md font-semibold text-neutral-primary">
              -
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
