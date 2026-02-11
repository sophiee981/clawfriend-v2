"use client";

import { CheckLine, InformationFill } from "@/components/icons";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";

export const TakeProfitStopLoss = () => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center p-0.5">
        <button
          type="button"
          onClick={() => setChecked(!checked)}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
            checked
              ? "bg-primary border-primary text-neutral-inverse"
              : "bg-neutral-01 border-neutral-03"
          }`}
        >
          {checked && <CheckLine />}
        </button>
      </div>
      <div className="flex items-center gap-1 flex-1">
        <span className="text-body-xs text-neutral-tertiary">
          {t("tradingInterface.takeProfitStopLoss")}
        </span>
        <InformationFill className="text-neutral-tertiary" />
        <div className="flex items-center px-1.5 py-0.5 bg-neutral-03 rounded-full">
          <span className="text-label-2xs text-neutral-secondary">
            {t("tradingInterface.soon")}
          </span>
        </div>
      </div>
    </div>
  );
};
