"use client";

import { CheckLine } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useClosedMarket } from "@/hooks";
import { useTranslation } from "@/hooks/useTranslation";
import { useMarketSlugStore } from "@/stores/market-slug.store";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface ClosedMarketMaskProps {
  className?: string;
  canClaim?: boolean;
  isClaimed?: boolean;
  onClaim?: () => void;
  onViewPortfolio?: () => void;
  outcome?: string;
  shortTitle?: string;
}

export const ClosedMarketMask = ({
  className,
  canClaim = false,
  isClaimed = false,
  onClaim,
  onViewPortfolio,
  outcome,
  shortTitle,
}: ClosedMarketMaskProps) => {
  const { t } = useTranslation();
  const slug = useMarketSlugStore(state => state.slug);
  const { isClosed } = useClosedMarket(slug);

  return (
    <>

      {/* State 1: Can claim - shows "Payout Ready 🎉" with "Claim Now" button */}
      {canClaim && !isClaimed && (
        <div
          className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 p-16 bg-overlay-dark-70 backdrop-blur-[16px] ${className || ""
            }`}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Text Content */}
          <div className="flex flex-col items-center gap-1 w-full">
            <h3 className="text-label-lg text-neutral-primary text-center">
              {t("tradingInterface.closedMarket.payoutReady")}
            </h3>
            <p className="text-body-xs text-neutral-secondary text-center whitespace-pre-wrap">
              {t("tradingInterface.closedMarket.payoutReadyDescription")}
            </p>
          </div>

          {/* Claim Button */}
          {onClaim && (
            <Button
              variant="primary"
              buttonType="filled"
              onClick={onClaim}
              className="w-fit"
            >
              {t("tradingInterface.closedMarket.claimNow")}
            </Button>
          )}
        </div>
      )}

      {/* State 2: Already claimed - shows "Payout Claimed!" with "View in Portfolio" button */}
      {isClaimed && (
        <div
          className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 p-16 bg-overlay-dark-70 backdrop-blur-[16px] ${className || ""
            }`}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Text Content */}
          <div className="flex flex-col items-center gap-1 w-full">
            <h3 className="text-label-lg text-neutral-primary text-center">
              {t("tradingInterface.closedMarket.payoutClaimed")}
            </h3>
            <p className="text-body-xs text-neutral-secondary text-center">
              {t("tradingInterface.closedMarket.payoutClaimedDescription")}
            </p>
          </div>

          {/* View Portfolio Button */}
          {onViewPortfolio && (
            <Button
              variant="secondary"
              buttonType="tonal"
              onClick={onViewPortfolio}
              className="w-fit"
            >
              {t("tradingInterface.closedMarket.viewInPortfolio")}
            </Button>
          )}
        </div>
      )}

      {/* State 3: Closed but no claim available - shows "Market Resolved" message */}
      {/* Show mask if market is closed OR if countdown has expired */}
      {isClosed && !canClaim && !isClaimed && (
        <div
          className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 p-16 bg-overlay-dark-70 backdrop-blur-[16px] ${className || ""
            }`}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-success bg-success-muted-10">
            <CheckLine className="text-success text-2xl" />
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-center gap-2 w-full">
            {/* Title with Outcome and Value */}
            <div className="flex flex-col items-center justify-center w-full gap-0">
              {outcome ? (
                <>
                  <h3 className="text-label-lg text-neutral-primary text-center">
                    {t("tradingInterface.closedMarket.outcomeLabel", {
                      outcome,
                    })}
                  </h3>
                  {shortTitle && (
                    <p className="text-label-sm text-primary text-center">
                      {shortTitle}
                    </p>
                  )}
                </>
              ) : (
                <h3 className="text-label-lg text-neutral-primary text-center">
                  {t("tradingInterface.closedMarket.title")}
                </h3>
              )}
            </div>
            <p className="text-body-xs text-neutral-secondary text-center">
              {t("tradingInterface.closedMarket.description")}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
