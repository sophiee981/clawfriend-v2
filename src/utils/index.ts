import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // Define custom font-size utilities that won't conflict with text colors
      "font-size": [
        "text-display-lg",
        "text-display-md",
        "text-heading-lg",
        "text-heading-md",
        "text-heading-sm",
        "text-label-lg",
        "text-label-md",
        "text-label-sm",
        "text-label-xs",
        "text-label-2xs",
        "text-label-3xs",
        "text-label-3xs-uc",
        "text-body-lg",
        "text-body-md",
        "text-body-sm",
        "text-body-xs",
        "text-body-2xs",
        "text-body-3xs",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAvatarUrl = (seed: string, style: string = "bottts-neutral") =>
  `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(
    seed || Math.random().toString(36).substring(7),
  )}`;

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
