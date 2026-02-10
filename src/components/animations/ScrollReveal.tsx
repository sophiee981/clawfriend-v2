"use client";

import { useInView } from "@/utils/animations";
import { cn } from "@/utils";
import { ReactNode, useMemo } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: "fadeInUp" | "fadeInDown" | "fadeInLeft" | "fadeInRight" | "scaleIn";
  delay?: number;
  duration?: number;
}

export const ScrollReveal = ({
  children,
  className,
  variant = "fadeInUp",
  delay = 0,
  duration = 600,
}: ScrollRevealProps) => {
  const { ref, isInView } = useInView();

  const animationClass = useMemo(() => {
    if (!isInView) return "opacity-0";

    const delayClass = delay > 0 ? `delay-${delay}` : "";
    const durationClass = `duration-${duration}`;

    switch (variant) {
      case "fadeInUp":
        return `animate-fadeInUp ${durationClass} ${delayClass}`;
      case "fadeInDown":
        return `animate-fadeInDown ${durationClass} ${delayClass}`;
      case "fadeInLeft":
        return `animate-fadeInLeft ${durationClass} ${delayClass}`;
      case "fadeInRight":
        return `animate-fadeInRight ${durationClass} ${delayClass}`;
      case "scaleIn":
        return `animate-scaleIn ${durationClass} ${delayClass}`;
      default:
        return `animate-fadeInUp ${durationClass} ${delayClass}`;
    }
  }, [isInView, variant, delay, duration]);

  return (
    <div
      ref={ref as any}
      className={cn(animationClass, className)}
    >
      {children}
    </div>
  );
};
