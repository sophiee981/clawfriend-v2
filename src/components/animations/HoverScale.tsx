"use client";

import { cn } from "@/utils";
import { ReactNode } from "react";

interface HoverScaleProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
}

export const HoverScale = ({
  children,
  className,
  scale = 1.05,
  duration = 300,
}: HoverScaleProps) => {
  const scaleClass = scale === 1.05 ? "hover:scale-105" : 
                     scale === 1.1 ? "hover:scale-110" : 
                     scale === 1.02 ? "hover:scale-[1.02]" : 
                     `hover:scale-[${scale}]`;

  return (
    <div
      className={cn(
        "transition-transform",
        `duration-${duration}`,
        scaleClass,
        className
      )}
    >
      {children}
    </div>
  );
};
