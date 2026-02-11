"use client";

import { chains } from "@/configs/wallet.config";
import { CLAW_FRIEND_CONTRACT_ADDRESS } from "@/constants";
import { ClawFriendContractFactory } from "@/lib/contracts/clawfriend";
import { useEffect } from "react";

export const AppInitlize = () => {
  useEffect(() => {
    if (CLAW_FRIEND_CONTRACT_ADDRESS) {
      ClawFriendContractFactory.getInstance().init(
        CLAW_FRIEND_CONTRACT_ADDRESS,
        chains
      );
    }
  }, []);

  return null;
};
