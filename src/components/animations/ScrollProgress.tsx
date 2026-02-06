"use client";

import { useScrollProgress } from "@/utils/animations";

export const ScrollProgress = () => {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-white/5">
      <div
        className="h-full bg-gradient-to-r from-[#fe5631] via-orange-400 to-yellow-400 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(254,86,49,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
