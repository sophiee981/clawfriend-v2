"use client";

import { useTranslation } from "@/hooks/useTranslation";

interface SellBelowMarketWarningProps {
  show: boolean;
}

export const SellBelowMarketWarning = ({
  show,
}: SellBelowMarketWarningProps) => {
  const { t } = useTranslation();

  if (!show) {
    return null;
  }

  return (
    <div className="bg-warning-muted-10 rounded-sm px-4 py-3">
      <p className="text-body-xs text-warning">
        {t("tradingInterface.priceInput.sellBelowMarketWarning")}
      </p>
    </div>
  );
};
