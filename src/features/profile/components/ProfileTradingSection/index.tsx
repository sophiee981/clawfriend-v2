"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProfileSidebarSectionHeader } from "../ProfileSidebarSectionHeader";
import { ProfileSharesInput } from "./ProfileSharesInput";
import { OrderSideToggle } from "./OrderSideToggle";

type OrderSide = "buy" | "sell";

interface ProfileTradingSectionProps {
  profileName: string;
}

export const ProfileTradingSection = ({ profileName }: ProfileTradingSectionProps) => {
  const [orderSide, setOrderSide] = useState<OrderSide>("buy");
  const [shares, setShares] = useState("");
  const totalBalance = 0;
  const pricePerShare = 0.5; // Default price, will come from market context

  return (
    <div className="flex flex-col pb-8">
      <ProfileSidebarSectionHeader title="Trading" />
      <div className="relative flex flex-col gap-4 p-4">
        <OrderSideToggle orderSide={orderSide} onChange={setOrderSide} />

        {/* Shares input with quick amounts, total, balance */}
        <ProfileSharesInput
          orderSide={orderSide}
          shares={shares}
          onChange={setShares}
          totalBalance={totalBalance}
          pricePerShare={pricePerShare}
        />

        {/* Trade button */}
        <div className="flex flex-col gap-3 pt-1">
          <Button
            variant="primary"
            buttonType="filled"
            size="lg"
            className="w-full text-label-sm font-semibold rounded border-[4px] border-transparent transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
            disabled={!shares || parseFloat(shares) <= 0}
          >
            {orderSide === "buy" ? "Buy" : "Sell"} {shares ? `${shares} shares` : "shares"} - {profileName}
          </Button>
        </div>
      </div>
    </div>
  );
};
