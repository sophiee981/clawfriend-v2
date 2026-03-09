import { Skeleton } from "@/components/ui/skeleton";

export const TrendItemSkeleton = () => {
    return (
        <div className="flex gap-3 rounded-lg bg-neutral-02 px-4 py-3 border border-neutral-02">
            {/* Avatar */}
            <div className="shrink-0">
                <Skeleton variant="circle" className="h-10 w-10" />
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-row gap-4 items-center">
                {/* Column 1: Name and Username */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>

                {/* Column 2: Metric and Volume */}
                <div className="flex flex-col gap-1 items-end">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
        </div>
    );
};
