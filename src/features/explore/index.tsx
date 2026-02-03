"use client";

import { CompleteAvatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  BarsArrowDown,
  Clock,
  MagnifyingGlass,
  TwitterVerifiedBadge,
  XMark,
} from "@/components/icons";
import { useState, useEffect } from "react";

interface KOLData {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  followers: string;
  price: string;
  volume: string;
  isVerified?: boolean;
}

const MOCK_KOLS: KOLData[] = [
  {
    id: "1",
    name: "fan.tech",
    username: "@joinfantech",
    followers: "5.1K",
    price: "369.8",
    volume: "431.9K",
    isVerified: false,
  },
  {
    id: "2",
    name: "Defi_Maestro ✺",
    username: "@Defi_Maestro",
    followers: "46.8K",
    price: "245",
    volume: "325.6K",
    isVerified: true,
  },
  {
    id: "3",
    name: "Herro",
    username: "@HerroCrypto",
    followers: "84K",
    price: "387.2",
    volume: "105.5K",
    isVerified: false,
  },
  {
    id: "4",
    name: "Dr. B",
    username: "@fantechceo",
    followers: "1,324",
    price: "115.2",
    volume: "54.2K",
    isVerified: false,
  },
  {
    id: "5",
    name: "🉐 Crypto Linn",
    username: "@crypto_linn",
    followers: "46.2K",
    price: "405",
    volume: "71.2K",
    isVerified: false,
  },
  {
    id: "6",
    name: "Jordi Alexander",
    username: "@gametheorizing",
    followers: "84.7K",
    price: "793.8",
    volume: "57.3K",
    isVerified: true,
  },
  {
    id: "7",
    name: "Chairman",
    username: "@WSBChairman",
    followers: "32.4K",
    price: "192.2",
    volume: "45.6K",
    isVerified: true,
  },
  {
    id: "8",
    name: "Gracie Hartie ONLYF",
    username: "@graciehartie",
    followers: "92.6K",
    price: "561.8",
    volume: "49.3K",
    isVerified: true,
  },
  {
    id: "9",
    name: "andrew",
    username: "@andrewpixelrd",
    followers: "9",
    price: "20",
    volume: "42.4K",
    isVerified: false,
  },
  {
    id: "10",
    name: "Ignas | DeFi Research",
    username: "@DefiIgnas",
    followers: "66.5K",
    price: "145.8",
    volume: "36.6K",
    isVerified: true,
  },
];

const KOLCard = ({ kol }: { kol: KOLData }) => {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-neutral-01 bg-neutral-02 p-4">
      <CompleteAvatar
        src={kol.avatar}
        name={kol.name}
        size="lg"
        className="h-10 w-10 shrink-0"
      />
      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="text-body-md font-medium text-neutral-primary">
              {kol.name}
            </span>
            {kol.isVerified && (
              <TwitterVerifiedBadge className="h-4 w-4 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-body-sm text-neutral-tertiary">
              {kol.username}
            </span>
            <div className="h-1 w-1 rounded-full bg-neutral-tertiary opacity-40" />
            <div className="flex items-center gap-0.5">
              <span className="text-body-sm text-neutral-tertiary">
                {kol.followers}
              </span>
              <span className="text-body-sm text-neutral-tertiary">
                Followers
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <span className="text-body-sm text-danger">{kol.price}</span>
            <span className="text-body-sm text-danger">✺</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-body-sm text-neutral-tertiary">Vol</span>
            <span className="text-body-sm font-medium text-neutral-primary">
              {kol.volume}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

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

  // Filter KOLs based on activeSearch (only when Enter is pressed)
  const filteredKOLs = activeSearch
    ? MOCK_KOLS.filter(
      (kol) =>
        kol.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        kol.username.toLowerCase().includes(activeSearch.toLowerCase())
    )
    : MOCK_KOLS;

  return (
    <div className="flex h-full flex-col">
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
          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-lg border border-neutral-01 bg-neutral-02 shadow-lg">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-neutral-01"
                >
                  <MagnifyingGlass className="h-4 w-4 shrink-0 text-neutral-tertiary" />
                  <span className="text-body-md text-neutral-primary">
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Search Section */}
      {displayedRecentSearches.length > 0 && (
        <div className="border-b border-neutral-01 px-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-medium text-neutral-primary">
                Recent search
              </span>
              <button
                onClick={handleClearAll}
                className="text-label-sm font-medium text-danger hover:opacity-80"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {displayedRecentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleRecentSearchClick(search)}
                  className="flex items-center gap-2 rounded-lg border border-neutral-01 bg-neutral-01 px-3 py-2 transition-colors hover:bg-neutral-02"
                >
                  <Clock className="h-4 w-4 shrink-0 text-neutral-tertiary" />
                  <span className="text-body-md text-neutral-primary">
                    {search}
                  </span>
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
          {filteredKOLs.length > 0 ? (
            filteredKOLs.map((kol) => <KOLCard key={kol.id} kol={kol} />)
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-body-md text-neutral-tertiary">
                No profiles found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
