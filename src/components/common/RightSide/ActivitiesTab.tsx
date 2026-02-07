"use client";

import { ActivityItem } from "./ActivityItem";
import { ActivitySkeleton } from "./ActivitySkeleton";
import { useActivities } from "./useActivities";
import { useInfiniteScroll } from "./useInfiniteScroll";

interface ActivitiesTabProps {
  username?: string;
  enabled?: boolean;
}

export const ActivitiesTab = ({ username, enabled = true }: ActivitiesTabProps) => {
  const { activities, isLoading, isLoadingMore, hasNextPage, fetchNextPage } =
    useActivities({ enabled, username });

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
        activities.map((activity, index) => (
          <ActivityItem
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
