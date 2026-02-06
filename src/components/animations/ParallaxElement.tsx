"use client";

import { useParallax } from "@/utils/animations";
import { cn } from "@/utils";
import { ReactNode, CSSProperties } from "react";

interface ParallaxElementProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "vertical" | "horizontal";
}

export const ParallaxElement = ({
  children,
  className,
  speed = 0.5,
  direction = "vertical",
}: ParallaxElementProps) => {
  const { ref, offset } = useParallax(speed);

  const style: CSSProperties = {
    transform:
      direction === "vertical"
        ? `translateY(${offset}px)`
        : `translateX(${offset}px)`,
    willChange: "transform",
  };

  return (
    <div
      ref={ref as any}
      className={cn("transition-transform", className)}
      style={style}
    >
      {children}
    </div>
  );
};
