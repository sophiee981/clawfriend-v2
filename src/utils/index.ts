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

export const getAvatarUrl = (
  seed: string,
  style: string = "big-ears-neutral"
) =>
  `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(
    seed || Math.random().toString(36).substring(7)
  )}`;
