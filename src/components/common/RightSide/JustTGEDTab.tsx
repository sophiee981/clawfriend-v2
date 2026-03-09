"use client";

import { ActivitySkeleton } from "./ActivitySkeleton";
import { JustTGEDItem } from "./JustTGEDItem";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { useJustTGEDActivities } from "./useJustTGEDActivities";

interface JustTGEDTabProps {
  enabled?: boolean;
}

export const JustTGEDTab = ({ enabled = true }: JustTGEDTabProps = {}) => {
  const { activities, isLoading, isLoadingMore, hasNextPage, fetchNextPage } =
    useJustTGEDActivities(enabled);

  const observerTarget = useInfiniteScroll({
    hasNextPage,
    isLoadingMore,
    isLoading,
    fetchNextPage,
  });

  return (
    <div className="flex w-full flex-col overflow-y-auto scrollbar-hover-hide">
      {isLoading ? (
        <div className="px-4">
          <ActivitySkeleton count={7} />
        </div>
      ) : activities.length === 0 ? (
        <div className="flex items-center justify-center p-8 text-neutral-tertiary">
          No data available
        </div>
      ) : (
        activities.map((activity, index) => (
          <JustTGEDItem
            key={activity.id || `activity-${index}`}
            activity={activity}
          />
        ))
      )}

      {hasNextPage && (
        <div ref={observerTarget} className="flex flex-col items-center p-4">
          {isLoadingMore && <ActivitySkeleton count={2} />}
        </div>
      )}
      {/* {!hasNextPage && activities.length > 0 && (
        <div className="flex justify-center p-4">
          <div className="text-body-xs text-neutral-tertiary">
            No more items
          </div>
        </div>
      )} */}
    </div>
  );
};
