import type { AgentSummary } from "@/interfaces/agent";
import { getAgentsSummary } from "@/services/agent.service";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useJustTGEDActivities = (enabled: boolean) => {
  const query = useInfiniteQuery({
    queryKey: ["agents-summary", "just-tged"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getAgentsSummary({
        page: pageParam,
        limit: 20,
        search: "",
      });

      return {
        data: response?.data?.data || [],
        total: response?.data?.total || 0,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce(
        (sum, page) => sum + page.data.length,
        0
      );
      return totalLoaded < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled,
  });

  const activities: AgentSummary[] =
    query.data?.pages.flatMap((page) => page.data as AgentSummary[]) || [];

  return {
    activities,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
};
