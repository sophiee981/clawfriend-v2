"use client";

import { ChainPair, Copy } from "@/components/icons";
import { formatNumberShort } from "@/utils/number";
import { toast } from "@/utils/toast";
import { formatAddress } from "@/utils/web3";
import { useCallback } from "react";

interface WalletHeaderProps {
  address: string;
  holdingValue: string;
}

export const WalletHeader = ({ address, holdingValue }: WalletHeaderProps) => {
  const handleCopy = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied");
    }
  }, [address]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <span className="text-[13px] leading-4 text-neutral-tertiary">
          Address
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 w-fit group"
        >
          <span className="text-body-md text-neutral-primary font-mono group-hover:text-primary transition-colors">
            {formatAddress(address, 6)}
          </span>
          <Copy className="w-4 h-4 text-neutral-tertiary group-hover:text-primary transition-colors" />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[13px] leading-4 text-neutral-tertiary">
          Holding Value
        </span>
        <div className="flex items-center gap-1">
          <span className="text-xl font-medium leading-7 text-neutral-primary">
            {formatNumberShort(holdingValue)}
          </span>
          <ChainPair className="w-5 h-5 text-neutral-tertiary" />
        </div>
      </div>
    </div>
  );
};
