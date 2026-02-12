"use client";

import { ActivityItem } from "@/components/common/RightSide/ActivityItem";
import { ActivitySkeleton } from "@/components/common/RightSide/ActivitySkeleton";
import type { Trade } from "@/interfaces/trade";
import { getTraderActivities } from "@/services";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

interface WalletActivitiesTabProps {
  address: string;
}

export const WalletActivitiesTab = ({ address }: WalletActivitiesTabProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["trader-activities", address],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await getTraderActivities(address, {
          page: pageParam,
          limit: 20,
        });

        const activities: Trade[] = response?.data?.results || [];
        return {
          results: activities,
          totalItems: response?.data?.totalItems || 0,
        };
      },
      getNextPageParam: (lastPage, allPages) => {
        const totalLoaded = allPages.reduce(
          (sum, page) => sum + page.results.length,
          0
        );
        return totalLoaded < lastPage.totalItems
          ? allPages.length + 1
          : undefined;
      },
      initialPageParam: 1,
      enabled: !!address,
    });

  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allActivities =
    data?.pages.flatMap((page) => page.results as Trade[]) || [];

  // Filter duplicate IDs to ensure unique keys
  const seenIds = new Set<string>();
  const activities: Trade[] = [];
  const itemsWithoutId: Trade[] = [];

  for (const activity of allActivities) {
    if (activity.id) {
      if (!seenIds.has(activity.id)) {
        seenIds.add(activity.id);
        activities.push(activity);
      }
    } else {
      itemsWithoutId.push(activity);
    }
  }

  activities.push(...itemsWithoutId);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col overflow-y-auto scrollbar-hover-hide">
        <ActivitySkeleton count={5} />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex w-full flex-col overflow-y-auto scrollbar-hover-hide">
        <div className="flex items-center justify-center p-8 text-neutral-tertiary">
          No activities available
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col overflow-y-auto scrollbar-hover-hide">
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity.id || `activity-${index}`}
          activity={activity}
        />
      ))}

      {hasNextPage && (
        <div ref={loadMoreRef} className="flex flex-col items-center p-4">
          {isFetchingNextPage && <ActivitySkeleton count={2} />}
        </div>
      )}
    </div>
  );
};
