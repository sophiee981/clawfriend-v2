"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import React from "react";

interface WalletModalProps {
  children: React.ReactNode;
}

export const WalletModal = ({ children }: WalletModalProps) => {
  const { openConnectModal } = useConnectModal();

  return (
    <div
      onClick={() => openConnectModal?.()}
      role="button"
      tabIndex={0}
      className="inline-block"
      onKeyDown={(e) => e.key === "Enter" && openConnectModal?.()}
    >
      {children}
    </div>
  );
};

export default WalletModal;
