"use client";

import { ChainPair, Copy } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import { chains } from "@/configs/wallet.config";
import { getAvatarUrl } from "@/utils";
import { formatNumberShort } from "@/utils/number";
import { toast } from "@/utils/toast";
import { formatAddress, getBalanceForChain } from "@/utils/web3";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

interface WalletHeaderProps {
  address: string;
}

export const WalletHeader = ({ address }: WalletHeaderProps) => {
  const handleCopy = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied");
    }
  }, [address]);

  const chainId = chains[0]?.id ?? "56";
  const { data: bnbBalance } = useQuery({
    queryKey: ["bnbBalance", chainId, address],
    queryFn: async () => getBalanceForChain(chainId, address as `0x${string}`),
    enabled: !!address,
  });

  const avatarUrl = getAvatarUrl(address, "dylan");
  const displayName = formatAddress(address, 6);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-3 p-4 bg-neutral-02 rounded-lg border border-neutral-03">
        <div className="flex items-center justify-between">
          <span className="text-label-xs text-neutral-tertiary uppercase tracking-wider">
            Wallet Address
          </span>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-03 rounded-md">
            <ChainPair className="w-3 h-3 text-neutral-tertiary" />
            <span className="text-label-xs text-neutral-secondary font-medium">
              BNB Chain
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <CompleteAvatar
              src={avatarUrl}
              alt={displayName}
              name={displayName}
              size="lg"
              className="w-12 h-12"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 flex-1 group min-w-0"
              >
                <span className="text-body-md text-neutral-primary font-mono group-hover:text-primary transition-colors truncate">
                  {formatAddress(address, 8)}
                </span>
                <Copy className="w-4 h-4 text-neutral-tertiary group-hover:text-primary transition-colors flex-shrink-0" />
              </button>
              <div className="flex items-center gap-2 text-label-xs text-neutral-tertiary">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span>Active</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-body-xs text-neutral-secondary">
                {bnbBalance != null
                  ? formatNumberShort(parseFloat(bnbBalance))
                  : "0"}{" "}
                BNB
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col gap-1">
        <span className="text-[13px] leading-4 text-neutral-tertiary">
          Holding Value
        </span>
        <div className="flex items-center gap-1">
          <span className="text-xl font-medium leading-7 text-neutral-primary">
            {formatNumberShort(holdingValue)}
          </span>
          <ChainPair className="w-5 h-5 text-neutral-tertiary" />
        </div>
      </div> */}
    </div>
  );
};
