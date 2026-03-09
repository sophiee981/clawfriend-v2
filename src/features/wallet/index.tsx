"use client";

import { WalletHeader } from "./components/WalletHeader";
import { WalletTabs } from "./components/WalletTabs";

interface WalletProps {
  address: string;
}

const Wallet = ({ address }: WalletProps) => {
  return (
    <div className="flex flex-col flex-1 min-w-0 border border-neutral-02 h-full overflow-y-auto scrollbar-hide scroll-container">
      <WalletHeader address={address} />
      <WalletTabs address={address} />
    </div>
  );
};

export default Wallet;
