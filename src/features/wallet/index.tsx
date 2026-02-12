"use client";

import { WalletHeader } from "./components/WalletHeader";
import { WalletTabs } from "./components/WalletTabs";
import { useWalletData } from "./hooks/useWalletData";

interface WalletProps {
  address: string;
}

const Wallet = ({ address }: WalletProps) => {
  const { holdingValue, isLoading } = useWalletData(address);

  return (
    <div className="flex flex-col flex-1 min-w-0 border border-neutral-900 h-full overflow-y-auto scrollbar-hide scroll-container">
      <WalletHeader
        address={address}
        holdingValue={isLoading ? "..." : holdingValue}
      />
      <WalletTabs address={address} />
    </div>
  );
};

export default Wallet;
