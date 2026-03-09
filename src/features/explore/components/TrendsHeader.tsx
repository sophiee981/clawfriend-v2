"use client";

import { BarsArrowDown } from "@/components/icons";

export const TrendsHeader = () => {
  return (
    <div className="flex items-center justify-between px-4 pt-2 sm:pt-4">
      <h2 className="text-heading-sm font-medium text-neutral-primary">
        Trends for you
      </h2>
      {/* <button className="flex items-center justify-end gap-2">
        <BarsArrowDown className="h-5 w-5 text-neutral-tertiary" />
      </button> */}
    </div>
  );
};
