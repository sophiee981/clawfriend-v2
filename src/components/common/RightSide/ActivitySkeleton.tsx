import { Skeleton } from "@/components/ui/skeleton";

interface ActivitySkeletonProps {
  count?: number;
}

export const ActivitySkeleton = ({ count = 1 }: ActivitySkeletonProps) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="flex w-full gap-3 border-b border-neutral-02 py-4"
        >
          <Skeleton variant="circle" customWidth="40px" customHeight="40px" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton variant="text" width="full" size="md" />
            <Skeleton variant="text" width="1/2" size="sm" />
          </div>
        </div>
      ))}
    </>
  );
};
