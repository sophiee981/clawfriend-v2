"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const SkillCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-neutral-02 bg-bg-secondary">
      {/* Header: Avatar, Author info, More button */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <Skeleton variant="circle" customWidth="40px" customHeight="40px" />
          <div className="flex flex-col gap-1.5">
            <Skeleton customWidth="100px" customHeight="14px" />
            <Skeleton customWidth="80px" customHeight="12px" />
          </div>
        </div>
        <Skeleton customWidth="20px" customHeight="20px" />
      </div>

      {/* Title and Badge */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Skeleton customWidth="60%" customHeight="18px" />
          <Skeleton customWidth="40px" customHeight="20px" />
        </div>

      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <Skeleton customWidth="60px" customHeight="20px" />
        <Skeleton customWidth="80px" customHeight="20px" />
        <Skeleton customWidth="70px" customHeight="20px" />
      </div>

      {/* Footer: Stars, Downloads, Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-02 mt-auto">
        <div className="flex gap-4">
          <Skeleton customWidth="50px" customHeight="16px" />
          <Skeleton customWidth="70px" customHeight="16px" />
        </div>
        <div className="flex gap-2">
          <Skeleton customWidth="32px" customHeight="32px" />
          <Skeleton customWidth="100px" customHeight="32px" />
        </div>
      </div>
    </div>
  );
};
