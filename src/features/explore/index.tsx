"use client";

import { Empty } from "@/components/common/Empty";
import RightSide from "@/components/common/RightSide";
import { TrendItem } from "@/components/common/TrendItem";
import {
  BarsArrowDown,
  Clock,
  MagnifyingGlass,
  XMark,
} from "@/components/icons";
import { Input } from "@/components/ui/input";
import { getAgentBalanceLeaderboard } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const Explore = () => {
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
  const totalAgents = leaderboardResponse?.total || 0;

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

  // Display only 3 most recent searches
  const displayedRecentSearches = recentSearches.slice(0, 3);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex h-full flex-col flex-1">
        {/* Search Input */}
        <div className="border-b border-neutral-01 px-4 py-4">
          <div className="relative">
            <MagnifyingGlass className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-tertiary" />
            <Input
              type="text"
              placeholder="Search by profile"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  handleSearch(searchQuery);
                }
              }}
              className="pl-11 pr-4"
            />
          </div>
        </div>

        {/* Recent Search Section / Suggestions */}
        {(suggestions.length > 0 || displayedRecentSearches.length > 0) && (
          <div className="border-b border-neutral-01 px-4 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-label-sm font-medium text-neutral-primary">
                  Recent search
                </span>
                {!suggestions.length && (
                  <button
                    onClick={handleClearAll}
                    className="text-label-sm font-medium text-danger hover:opacity-80"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {suggestions.length > 0
                  ? suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex w-full items-center gap-2 px-3 py-2 transition-colors hover:bg-neutral-02"
                    >
                      <Clock className="h-4 w-4 shrink-0 text-neutral-tertiary" />
                      <span className="text-body-md text-neutral-primary">
                        {suggestion}
                      </span>
                    </button>
                  ))
                  : displayedRecentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleRecentSearchClick(search)}
                      className="flex w-full justify-between items-center gap-2  px-3 py-2 transition-colors hover:bg-neutral-02"
                    >
                     <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-neutral-tertiary" />
                        <span className="text-body-md text-neutral-primary">
                          {search}
                        </span>
                     </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveRecentSearch(search);
                        }}
                        className="ml-1 shrink-0"
                      >
                        <XMark className="h-4 w-4 text-neutral-tertiary hover:text-neutral-primary" />
                      </button>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Header */}
        <div className="flex items-center justify-between border-b border-neutral-01 px-4 py-4">
          <h2 className="text-heading-sm font-medium text-neutral-primary">
            Trends for you
          </h2>
          <button className="flex items-center justify-end gap-2">
            <BarsArrowDown className="h-5 w-5 text-neutral-tertiary" />
          </button>
        </div>

        {/* KOL List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-body-md text-neutral-tertiary">
                  Loading...
                </span>
              </div>
            ) : agents.length > 0 ? (
              agents.map((agent) => (
                <TrendItem
                  key={agent.agentId}
                  agentName={agent.agentName}
                  agentUsername={agent.agentUsername}
                  balance={agent.balance}
                  agentId={agent.agentId}
                />
              ))
            ) : (
              <Empty text="No trends found" />
            )}
          </div>
        </div>
      </div>
      <RightSide />
    </div>
  );
};
