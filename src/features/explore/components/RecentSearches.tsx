"use client";

import { Clock, XMark } from "@/components/icons";

interface RecentSearchesProps {
  recentSearches: string[];
  onRecentSearchClick: (search: string) => void;
  onRemoveRecentSearch: (search: string) => void;
  onClearAll: () => void;
}

export const RecentSearches = ({
  recentSearches,
  onRecentSearchClick,
  onRemoveRecentSearch,
  onClearAll,
}: RecentSearchesProps) => {
  const displayedRecentSearches = recentSearches.slice(0, 3);

  if (displayedRecentSearches.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-neutral-01 px-4 py-2 sm:py-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-label-sm font-medium text-neutral-primary">
            Recent search
          </span>
          <button
            onClick={onClearAll}
            className="text-label-sm font-medium text-danger hover:opacity-80"
          >
            Clear all
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {displayedRecentSearches.map((search) => (
            <button
              key={search}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRecentSearchClick(search);
              }}
              className="flex w-full justify-between items-center gap-2 px-3 py-2 transition-colors hover:bg-neutral-02"
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
                  onRemoveRecentSearch(search);
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
  );
};
