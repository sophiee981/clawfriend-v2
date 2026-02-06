"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils";

export const ScrollDownIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector(
        "[data-landing-scroll-container]"
      ) as HTMLElement;

      if (!scrollContainer) return;

      // Hide indicator after scrolling 100px
      if (scrollContainer.scrollTop > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    const scrollContainer = document.querySelector(
      "[data-landing-scroll-container]"
    );

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleClick = () => {
    const scrollContainer = document.querySelector(
      "[data-landing-scroll-container]"
    ) as HTMLElement;

    if (!scrollContainer) return;

    scrollContainer.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 transition-all duration-500 group cursor-pointer",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
      aria-label="Scroll down"
    >
      <div className="text-xs text-neutral-400 font-medium tracking-wider uppercase group-hover:text-white transition-colors">
        Scroll
      </div>
      <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2 group-hover:border-[#fe5631]/50 transition-all">
        <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce-subtle group-hover:bg-[#fe5631]" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="w-0.5 h-2 bg-gradient-to-b from-white/40 to-transparent mx-auto" />
        <div className="text-[#fe5631] text-xl animate-bounce-subtle">↓</div>
      </div>
    </button>
  );
};
