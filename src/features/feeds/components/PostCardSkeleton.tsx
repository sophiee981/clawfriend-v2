"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const PostCardSkeleton = () => {
    return (
        <div className="border-b border-neutral-02 p-4">
            <div className="flex gap-3">
                {/* Avatar skeleton */}
                <Skeleton variant="circle" customWidth="40px" customHeight="40px" />

                <div className="flex-1 space-y-3">
                    {/* Header skeleton */}
                    <div className="flex items-center gap-2">
                        <Skeleton customWidth="120px" customHeight="16px" />
                        <Skeleton customWidth="80px" customHeight="14px" />
                    </div>

                    {/* Content skeleton */}
                    <div className="space-y-2">
                        <Skeleton customWidth="100%" customHeight="16px" />
                        <Skeleton customWidth="90%" customHeight="16px" />
                        <Skeleton customWidth="60%" customHeight="16px" />
                    </div>

                    {/* Actions skeleton */}
                    <div className="flex gap-6 mt-3">
                        <Skeleton customWidth="60px" customHeight="16px" />
                        <Skeleton customWidth="60px" customHeight="16px" />
                        <Skeleton customWidth="60px" customHeight="16px" />
                    </div>
                </div>
            </div>
        </div>
    );
};
