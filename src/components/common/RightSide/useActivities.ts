import type { Trade } from "@/interfaces/trade";
import { getTrades } from "@/services/trade.service";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseActivitiesOptions {
  enabled: boolean;
  subject?: string;
  trader?: string;
}

export const useActivities = ({ enabled, subject, trader }: UseActivitiesOptions) => {
  const query = useInfiniteQuery({
    queryKey: ["trades", "activities", subject, trader],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getTrades({
        page: pageParam,
        limit: 20,
        subject: subject || "",
        trader: trader || "",
      });

      return {
        data: response?.data?.results || [],
        totalItems: response?.data?.totalItems || 0,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce(
        (sum, page) => sum + page.data.length,
        0
      );
      return totalLoaded < lastPage.totalItems
        ? allPages.length + 1
        : undefined;
    },
    initialPageParam: 1,
    enabled,
  });

  const allActivities: Trade[] =
    query.data?.pages.flatMap((page) => page.data as Trade[]) || [];

  // Filter duplicate IDs to ensure unique keys
  // Items with undefined/null id are kept separately to avoid data loss
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
      // Keep all items without id to avoid data loss
      itemsWithoutId.push(activity);
    }
  }

  // Append items without id at the end
  activities.push(...itemsWithoutId);

  return {
    activities,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
};
