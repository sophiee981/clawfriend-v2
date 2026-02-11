"use client";

import RightSide from "@/components/common/RightSide";
import {
  AgentBalanceLeaderboard,
  AgentListItem,
  GetAgentsResponse,
} from "@/interfaces/agent";
import { getAgents } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ExploreMobile,
  RecentSearches,
  SearchInput,
  TrendsHeader,
  TrendsList,
} from "./components";

export const Explore = ({
  isSearchPage = false,
}: {
  isSearchPage?: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const isSearchingRef = useRef(false);

  // Use search endpoint if activeSearch exists, otherwise use trends endpoint
  const hasSearch = activeSearch.trim().length > 0;

  const { data, isLoading } = useQuery({
    queryKey: hasSearch
      ? ["agentsExplore", activeSearch]
      : ["agentsExplore", "trending"],
    queryFn: async () => {
      const response = await getAgents({
        page: 1,
        limit: hasSearch ? 20 : 10,
        sortBy: "SHARE_PRICE",
        sortOrder: "DESC",
        ...(hasSearch && { search: activeSearch }),
      });
      return response.data;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    refetchOnMount: true,
  });

  // Map response to AgentBalanceLeaderboard format for compatibility - memoized for performance
  const agents: AgentBalanceLeaderboard[] = useMemo(() => {
    const agentsData = (data as GetAgentsResponse | undefined) ?? [];
    return agentsData.map((agent: AgentListItem) => ({
      agentId: agent.id,
      agentDisplayName: agent.displayName,
      agentUsername: agent.username,
      agentXUsername: agent.xOwnerHandle,
      agentXOwnerHandle: agent.xOwnerHandle,
      agentXOwnerName: agent.xOwnerName,
      balance: agent.subjectShare?.volumeBnb || "0",
      volumeBnb: agent.subjectShare?.volumeBnb || "0",
      currentPrice: agent.subjectShare?.currentPrice || "0",
      walletAddress: agent.walletAddress,
      lastPingAt: agent.lastPingAt,
      rank: 0, // Agents don't have rank
      followersCount: agent.followersCount,
    }));
  }, [data]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("explore_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Save recent searches to localStorage (max 100 items) - debounced to avoid excessive writes
  useEffect(() => {
    if (recentSearches.length === 0) return;

    const timer = setTimeout(() => {
      localStorage.setItem(
        "explore_recent_searches",
        JSON.stringify(recentSearches),
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [recentSearches]);


  // Debounce search: automatically call handleSearch after 500ms of no typing
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    // If search query is cleared, reset activeSearch immediately
    if (!trimmedQuery) {
      setActiveSearch("");
      return;
    }

    // Set up debounce timer
    const debounceTimer = setTimeout(() => {
      // Only trigger search if query has changed from current activeSearch
      if (trimmedQuery !== activeSearch) {
        handleSearch(trimmedQuery);
      }
    }, 500);

    // Cleanup timer on unmount or when searchQuery changes
    return () => {
      clearTimeout(debounceTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]); // Only depend on searchQuery to avoid infinite loop

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Set flag to prevent useEffect from updating suggestions
    isSearchingRef.current = true;

    // Set active search first to prevent useEffect from updating suggestions
    setActiveSearch(trimmedQuery);

    // Save to recent searches (max 100 items)
    setRecentSearches((prev) => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter((s) => s !== trimmedQuery);
      // Add to beginning and limit to 100
      return [trimmedQuery, ...filtered].slice(0, 100);
    });

    // Reset flag after a short delay to allow state updates to complete
    setTimeout(() => {
      isSearchingRef.current = false;
    }, 100);
  };

  const handleRemoveRecentSearch = (search: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== search));
  };

  const handleClearAll = () => {
    setRecentSearches([]);
    localStorage.removeItem("explore_recent_searches");
  };

  const handleRecentSearchClick = (search: string) => {
    // Set activeSearch first to prevent useEffect from showing suggestions
    handleSearch(search);
    // Then update searchQuery to show in input
    setSearchQuery(search);
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={`flex h-full flex-col mt-4 flex-1 ${!isSearchPage ? "max-sm:hidden" : "w-full"}`}
      >
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />

        <RecentSearches
          recentSearches={recentSearches}
          onRecentSearchClick={handleRecentSearchClick}
          onRemoveRecentSearch={handleRemoveRecentSearch}
          onClearAll={handleClearAll}
        />

        <TrendsHeader />

        <TrendsList
          agents={agents}
          isLoading={isLoading}
          hasNextPage={false}
          isFetchingNextPage={false}
          onLoadMore={() => { }}
        />
      </div>
      <div className="hidden sm:block">
        <RightSide />
      </div>
      <div
        className={`block sm:hidden w-full ${isSearchPage ? "hidden" : "w-full"}`}
      >
        <ExploreMobile
          agents={agents}
          isLoading={isLoading}
          hasNextPage={false}
          isFetchingNextPage={false}
          onLoadMore={() => { }}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
};
