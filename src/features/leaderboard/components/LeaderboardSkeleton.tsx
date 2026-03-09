export const LeaderboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`skeleton-top-${index}`}
            className="relative flex flex-col items-center rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-4"
          >
            <div className="h-16 w-16 rounded-full bg-neutral-03 animate-pulse mb-6" />
            <div className="h-4 w-20 bg-neutral-03 rounded animate-pulse mb-1" />
            <div className="h-3 w-16 bg-neutral-03 rounded animate-pulse mb-4" />
            <div className="h-4 w-16 bg-neutral-03 rounded animate-pulse mb-1" />
            <div className="h-3 w-12 bg-neutral-03 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-0">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={`skeleton-list-${index}`}
            className="flex w-full items-center gap-4 border-b border-neutral-02 px-4 py-4"
          >
            <div className="h-4 w-8 bg-neutral-03 rounded animate-pulse" />
            <div className="h-10 w-10 rounded-full bg-neutral-03 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-32 bg-neutral-03 rounded animate-pulse mb-1" />
              <div className="h-3 w-24 bg-neutral-03 rounded animate-pulse" />
            </div>
            <div className="h-4 w-16 bg-neutral-03 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};
