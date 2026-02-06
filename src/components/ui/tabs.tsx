"use client";

import { cn } from "@/utils";
import * as React from "react";

export interface TabItem<T extends string | number = string> {
  id: T;
  label: string;
}

export interface TabsProps<T extends string | number = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  className?: string;
  maxWidth?: string;
  indicatorClassName?: string;
}

function TabsComponent<T extends string | number = string>(
  {
    tabs,
    activeTab,
    onTabChange,
    className,
    maxWidth = "max-w-[672px]",
    indicatorClassName,
  }: TabsProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 border-b border-neutral-900 w-full",
        maxWidth,
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={String(tab.id)}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative flex h-14 shrink-0 items-center justify-center px-6 text-label-md transition-colors flex-1",
            activeTab === tab.id
              ? "text-neutral-primary"
              : "text-neutral-tertiary hover:text-neutral-secondary"
          )}
        >
          <span className="max-sm:text-[12px]">{tab.label}</span>
        </button>
      ))}
      {/* Sliding Active Indicator */}
      <div
        className={cn(
          "absolute bottom-0 h-0.5 rounded-t bg-primary transition-all duration-200 ease-out",
          indicatorClassName
        )}
        style={{
          left: `${(activeIndex * 100) / tabs.length}%`,
          width: `${100 / tabs.length}%`,
        }}
      />
    </div>
  );
}

export const Tabs = React.forwardRef(TabsComponent) as <
  T extends string | number = string
>(
  props: TabsProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;

(
  Tabs as React.ForwardRefExoticComponent<
    TabsProps<any> & React.RefAttributes<HTMLDivElement>
  >
).displayName = "Tabs";
