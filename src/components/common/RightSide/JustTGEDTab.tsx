"use client";

import { ActivitySkeleton } from "./ActivitySkeleton";
import { JustTGEDItem } from "./JustTGEDItem";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { useJustTGEDActivities } from "./useJustTGEDActivities";

export const JustTGEDTab = () => {
  const { activities, isLoading, isLoadingMore, hasNextPage, fetchNextPage } =
    useJustTGEDActivities(true);

  const observerTarget = useInfiniteScroll({
    hasNextPage,
    isLoadingMore,
    isLoading,
    fetchNextPage,
  });

  return (
    <div className="flex w-full flex-col overflow-y-auto scrollbar-hover-hide">
      {isLoading ? (
        <ActivitySkeleton count={5} />
      ) : activities.length === 0 ? (
        <div className="flex items-center justify-center p-8 text-neutral-tertiary">
          No data available
        </div>
      ) : (
        activities.map((activity) => (
          <JustTGEDItem key={activity.id} activity={activity} />
        ))
      )}

      {hasNextPage && (
        <div ref={observerTarget} className="flex flex-col items-center p-4">
          {isLoadingMore && <ActivitySkeleton count={2} />}
        </div>
      )}
      {!hasNextPage && activities.length > 0 && (
        <div className="flex justify-center p-4">
          <div className="text-body-xs text-neutral-tertiary">
            No more items
          </div>
        </div>
      )}
    </div>
  );
};
