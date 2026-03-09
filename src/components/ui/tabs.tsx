"use client";

import { cn } from "@/utils";
import * as React from "react";
import { useEffect, useState, useRef } from "react";

export interface TabItem<T extends string | number = string> {
  id: T;
  label: string;
  className?: string;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: string;
    width: string;
  }>({ left: "0%", width: "0%" });

  useEffect(() => {
    const updateIndicator = () => {
      if (!containerRef.current) return;

      const buttons = containerRef.current.querySelectorAll("button");
      const visibleButtons: HTMLButtonElement[] = [];

      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          visibleButtons.push(button);
        }
      });

      if (visibleButtons.length === 0) return;

      const activeButtonIndex = Array.from(buttons).findIndex(
        (btn) => btn.getAttribute("data-tab-id") === String(activeTab)
      );

      if (activeButtonIndex === -1) return;

      const activeButton = buttons[activeButtonIndex];
      if (!activeButton) return;

      const isActiveVisible = visibleButtons.includes(activeButton);
      if (!isActiveVisible) return;

      // Calculate position relative to container
      // offsetLeft is relative to the parent container, which is what we need
      const buttonLeft = activeButton.offsetLeft;
      const containerWidth = containerRef.current.offsetWidth;
      const buttonWidth = activeButton.offsetWidth;

      setIndicatorStyle({
        left: `${(buttonLeft / containerWidth) * 100}%`,
        width: `${(buttonWidth / containerWidth) * 100}%`,
      });
    };

    updateIndicator();

    const resizeObserver = new ResizeObserver(updateIndicator);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const handleScroll = () => {
      updateIndicator();
    };

    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", handleScroll);
    }

    window.addEventListener("resize", updateIndicator);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateIndicator);
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [tabs, activeTab]);

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      className={cn(
        "relative flex shrink-0 border-b border-neutral-02 w-full overflow-x-auto scrollbar-hide",
        maxWidth,
        className
      )}
    >
      <div className="flex flex-nowrap min-w-full">
        {tabs.map((tab) => (
          <button
            key={String(tab.id)}
            data-tab-id={String(tab.id)}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex h-14 shrink-0 items-center justify-center px-6 text-label-md transition-colors flex-1 min-w-fit",
              activeTab === tab.id
                ? "text-neutral-primary"
                : "text-neutral-tertiary hover:text-neutral-secondary",
              tab.className
            )}
          >
            <span className="max-sm:text-[13px] whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>
      {/* Sliding Active Indicator */}
      <div
        className={cn(
          "absolute bottom-0 h-0.5 rounded-t bg-primary transition-all duration-200 ease-out",
          indicatorClassName
        )}
        style={indicatorStyle}
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
