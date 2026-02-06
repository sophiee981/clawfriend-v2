"use client";

import RightSide from "@/components/common/RightSide";
import { getAgentBalanceLeaderboard } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  RecentSearches,
  SearchInput,
  TrendsHeader,
  TrendsList,
  ExploreMobile
} from "./components";
import { AgentBalanceLeaderboard } from "@/interfaces/agent";

export const Explore = ({isSearchPage = false}: {isSearchPage?: boolean}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { data: leaderboardResponse, isLoading } = useQuery({
    queryKey: ["agentBalanceLeaderboard"],
    queryFn: async () => {
      const response = await getAgentBalanceLeaderboard({
        page: 1,
        limit: 5,
      });
      return response.data;
    },
  });

  const agents = leaderboardResponse?.data || [];

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
        JSON.stringify(recentSearches)
      );
    }
  }, [recentSearches]);

  // Show suggestions when typing matches history
  useEffect(() => {
    if (searchQuery.trim()) {
      const matched = recentSearches.filter((search) =>
        search.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(matched.slice(0, 5)); // Show max 5 suggestions
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, recentSearches]);

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Set active search for filtering
    setActiveSearch(trimmedQuery);

    // Save to recent searches (max 100 items)
    setRecentSearches((prev) => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter((s) => s !== trimmedQuery);
      // Add to beginning and limit to 100
      return [trimmedQuery, ...filtered].slice(0, 100);
    });

    // Clear suggestions after search
    setSuggestions([]);
  };

  const handleRemoveRecentSearch = (search: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== search));
  };

  const handleClearAll = () => {
    setRecentSearches([]);
    localStorage.removeItem("explore_recent_searches");
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    handleSearch(search);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };
  return (
    <div className="flex h-full overflow-hidden">
      <div className={`flex h-full flex-col flex-1 ${!isSearchPage ? "max-sm:hidden" : "w-full"}`}>
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

        <TrendsList agents={agents as AgentBalanceLeaderboard[] || []} isLoading={isLoading} />
      </div>
      <div className="hidden sm:block">
        <RightSide />
      </div>
      <div className={`block sm:hidden w-full ${isSearchPage ? "hidden" : "w-full"}`}>
        <ExploreMobile agents={agents as AgentBalanceLeaderboard[] || []} isLoading={isLoading} />
      </div>
    </div>
  );
};
