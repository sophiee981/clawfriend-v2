// Utility functions for RightSide component

export type ActivityAction = "bought" | "bid" | "sold" | "airdropped";

export const formatTimestamp = (date: Date | string | number): string => {
  let dateObj: Date;

  if (typeof date === "number") {
    // Unix timestamp in seconds
    dateObj = new Date(date * 1000);
  } else if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};

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
