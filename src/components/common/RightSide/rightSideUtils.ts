// Utility functions for RightSide component

export type ActivityAction = "bought" | "bid" | "sold" | "airdropped";

// Get Basescan transaction URL
export const getTransactionUrl = (txHash: string): string => {
  const basescanUrl =
    process.env.NEXT_PUBLIC_BASESCAN_URL || "https://basescan.org";
  return `${basescanUrl}/tx/${txHash}`;
};

export const getActionColor = (action: string): string => {
  switch (action) {
    case "bought":
      return "text-success";
    case "bid":
      return "text-info";
    case "sold":
      return "text-danger";
    case "airdropped":
      return "text-indigo";
    default:
      return "text-neutral-primary";
  }
};
