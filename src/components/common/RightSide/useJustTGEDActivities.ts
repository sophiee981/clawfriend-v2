import type { AgentSummary, AgentsSummaryResponse } from "@/interfaces/agent";
import { getAgentsSummary } from "@/services/agent.service";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useJustTGEDActivities = (enabled: boolean) => {
  const query = useInfiniteQuery({
    queryKey: ["agents-summary", "just-tged"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = (await getAgentsSummary({
        page: pageParam,
        limit: 20,
        search: "",
      })) as unknown as AgentsSummaryResponse | undefined;

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

  const allActivities: AgentSummary[] =
    query.data?.pages.flatMap((page) => page.data) || [];

  // Filter duplicate IDs to ensure unique keys
  // Items with undefined/null id are kept separately to avoid data loss
  const seenIds = new Set<string>();
  const activities: AgentSummary[] = [];
  const itemsWithoutId: AgentSummary[] = [];

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
