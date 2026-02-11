"use client";

import { useTranslation } from "@/hooks/useTranslation";

interface EventMaskProps {
  className?: string;
}

export const EventMask = ({ className }: EventMaskProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 p-16 bg-overlay-dark-70 backdrop-blur-[16px] ${
        className || ""
      }`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Text Content */}
      <div className="flex flex-col items-center gap-1 w-full">
        <h3 className="text-label-lg text-neutral-primary text-center">
          {t("tradingInterface.eventMask.title")}
        </h3>
        <p className="text-body-xs text-neutral-secondary text-center">
          {t("tradingInterface.eventMask.description")}
        </p>
      </div>
    </div>
  );
};
