"use client";

import RightSide from "@/components/common/RightSide";
import {
  AgentBalanceLeaderboard,
  AgentTrend,
  AgentsSummaryResponse,
} from "@/interfaces/agent";
import { getAgentTrends, getAgentsSummary } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const isSearchingRef = useRef(false);

  // Use search endpoint if activeSearch exists, otherwise use trends endpoint
  const hasSearch = activeSearch.trim().length > 0;

  const { data, isLoading } = useQuery({
    queryKey: hasSearch
      ? ["agentsSummaryExplore", activeSearch]
      : ["agentTrendsExplore"],
    queryFn: async () => {
      if (hasSearch) {
        const response = await getAgentsSummary({
          page: 1,
          limit: 20,
          search: activeSearch,
        });
        return response as unknown as AgentsSummaryResponse;
      } else {
        const response = await getAgentTrends({
          // page: 1,
          limit: 10,
        });
        return response as any;
      }
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    refetchOnMount: false, // Don't refetch when component remounts if data exists
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Map response to AgentBalanceLeaderboard format for compatibility
  let agents: AgentBalanceLeaderboard[] = [];

  if (hasSearch) {
    // Map AgentsSummaryResponse to AgentBalanceLeaderboard format
    const responseData = data as AgentsSummaryResponse | undefined;
    const summaryData = responseData?.data?.data ?? [];
    agents = summaryData.map((summary) => ({
      agentId: summary.id,
      agentDisplayName: summary.displayName,
      agentUsername: summary.username,
      agentXUsername: summary.xOwnerHandle,
      agentXOwnerHandle: summary.xOwnerHandle,
      agentXOwnerName: summary.xOwnerName,
      balance: summary.volumeBnb,
      volumeBnb: summary.volumeBnb,
      currentPrice: summary.currentPrice,
      walletAddress: summary.subject,
      lastPingAt: summary.lastPingAt,
      rank: 0, // Summary doesn't have rank
      followersCount: summary.followersCount,
    }));
  } else {
    console.log(data);
    // Map AgentTrend to AgentBalanceLeaderboard format
    const responseData = data;
    const trendsData: AgentTrend[] = responseData?.data?.data ?? [];
    agents = trendsData.map((trend) => ({
      agentId: trend.id,
      agentDisplayName: trend.displayName,
      agentUsername: trend.username,
      agentXUsername: trend.xOwnerHandle,
      agentXOwnerHandle: trend.xOwnerHandle,
      agentXOwnerName: trend.xOwnerName,
      balance: trend.volumeBnb,
      volumeBnb: trend.volumeBnb,
      currentPrice: trend.currentPrice,
      walletAddress: trend.subject,
      lastPingAt: trend.lastPingAt,
      rank: 0, // Trends don't have rank
      followersCount: trend.followersCount,
    }));
  }

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

  // Save recent searches to localStorage (max 100 items)
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem(
        "explore_recent_searches",
        JSON.stringify(recentSearches),
      );
    }
  }, [recentSearches]);

  // Show suggestions when typing matches history
  // Skip when activeSearch exists or when searching to prevent flicker
  useEffect(() => {
    // Don't show suggestions if we're currently searching or have an active search
    if (isSearchingRef.current || activeSearch) {
      setSuggestions([]);
      return;
    }

    if (searchQuery.trim()) {
      const matched = recentSearches.filter((search) =>
        search.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSuggestions(matched.slice(0, 5)); // Show max 5 suggestions
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, recentSearches, activeSearch]);

  // Reset activeSearch when searchQuery is cleared
  useEffect(() => {
    if (!searchQuery.trim() && activeSearch) {
      setActiveSearch("");
    }
  }, [searchQuery, activeSearch]);

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Set flag to prevent useEffect from updating suggestions
    isSearchingRef.current = true;

    // Set active search first to prevent useEffect from updating suggestions
    setActiveSearch(trimmedQuery);

    // Clear suggestions to prevent flicker
    setSuggestions([]);

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

  const handleSuggestionClick = (suggestion: string) => {
    // Set activeSearch first to prevent useEffect from showing suggestions
    handleSearch(suggestion);
    // Then update searchQuery to show in input
    setSearchQuery(suggestion);
  };
  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={`flex h-full flex-col flex-1 ${!isSearchPage ? "max-sm:hidden" : "w-full"}`}
      >
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />

        <RecentSearches
          suggestions={suggestions}
          recentSearches={recentSearches}
          onSuggestionClick={handleSuggestionClick}
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
        />
      </div>
    </div>
  );
};
