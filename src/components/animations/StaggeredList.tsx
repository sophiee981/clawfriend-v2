"use client";

import { useStaggeredInView } from "@/utils/animations";
import { cn } from "@/utils";
import { ReactNode } from "react";

interface StaggeredListProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  itemClassName?: string;
}

export const StaggeredList = ({
  children,
  className,
  staggerDelay = 100,
  itemClassName,
}: StaggeredListProps) => {
  const { ref, visibleItems } = useStaggeredInView(children.length, staggerDelay);

  return (
    <div ref={ref as any} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all duration-500",
            visibleItems.includes(index)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10",
            itemClassName
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
