import type { Trade } from "@/interfaces/trade";
import { getTrades } from "@/services/trade.service";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useActivities = (enabled: boolean) => {
  const query = useInfiniteQuery({
    queryKey: ["trades", "activities"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getTrades({
        page: pageParam,
        limit: 20,
        subject: "",
        trader: "",
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

  const activities: Trade[] =
    query.data?.pages.flatMap((page) => page.data as Trade[]) || [];

  return {
    activities,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
};
