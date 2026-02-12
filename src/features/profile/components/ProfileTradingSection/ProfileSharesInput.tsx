"use client";

import { ChainPair } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatNumberShort } from "@/utils/number";

type OrderSide = "buy" | "sell" | "transfer";

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
  const balanceLabel = isBuy ? "Balance" : "Shares";

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
      <div className="flex items-center justify-end px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-body-xs text-neutral-tertiary">
            {balanceLabel}:
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
        className={`flex items-stretch rounded-lg overflow-hidden transition-all duration-200 focus-within:shadow-sm ${
          validationError ? "bg-danger-muted-10" : "bg-neutral-02"
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
      <TooltipProvider>
        <div className="flex flex-col gap-2 py-2.5 px-1 border-t border-neutral-03">
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-body-xs font-medium text-neutral-tertiary border-b border-dashed border-neutral-tertiary cursor-pointer">
                  Price
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-body-sm">
                  The price per share for this order
                </p>
              </TooltipContent>
            </Tooltip>
            {sharesValue <= 0 ? (
              <span className="text-label-xs font-medium text-neutral-primary">
                -
              </span>
            ) : sharesValue > 0 && price == null ? (
              <Skeleton customWidth="60px" customHeight="16px" />
            ) : (
              <span className="text-label-xs font-medium text-neutral-primary flex items-center gap-1">
                {formatBnb(price)}
                {price != null && <ChainPair className="w-3 h-3" />}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-body-xs font-medium text-neutral-tertiary border-b border-dashed border-neutral-tertiary cursor-pointer">
                  Fee
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-body-sm">
                  The trading fee for this transaction
                </p>
              </TooltipContent>
            </Tooltip>
            {sharesValue <= 0 ? (
              <span className="text-label-xs font-medium text-neutral-primary">
                -
              </span>
            ) : sharesValue > 0 && (price == null || priceAfterFee == null) ? (
              <Skeleton customWidth="50px" customHeight="16px" />
            ) : (
              <span className="text-label-xs font-medium text-neutral-primary flex items-center gap-1">
                {sharesValue > 0 && feeNum > 0 ? (
                  <>
                    {formatBnb(feeNum)}
                    <ChainPair className="w-3 h-3" />
                  </>
                ) : (
                  "-"
                )}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-body-xs font-medium text-neutral-tertiary border-b border-dashed border-neutral-tertiary cursor-pointer">
                  {isBuy ? "Total" : "You receive"}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-body-sm">
                  {isBuy
                    ? "Total amount you will pay including fees"
                    : "Total amount you will receive after fees"}
                </p>
              </TooltipContent>
            </Tooltip>
            {sharesValue <= 0 ? (
              <span className="text-label-md font-semibold text-neutral-primary">
                -
              </span>
            ) : sharesValue > 0 && priceAfterFee == null ? (
              <Skeleton customWidth="70px" customHeight="18px" />
            ) : (
              <span className="text-label-md font-semibold text-neutral-primary flex items-center gap-1">
                {formatBnb(priceAfterFee)}
                {priceAfterFee != null && <ChainPair className="w-3 h-3" />}
              </span>
            )}
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};
