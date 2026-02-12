"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import type { AgentListItem } from "@/interfaces";
import { getAgents } from "@/services";
import { formatAddress } from "@/utils/web3";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";

const DEBOUNCE_MS = 300;

interface AgentSelectionProps {
  selectedAgent: AgentListItem | null;
  hasError?: boolean;
  onSelect: (agent: AgentListItem) => void;
}

export const AgentSelection = ({
  selectedAgent,
  hasError = false,
  onSelect,
}: AgentSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchForApi, setSearchForApi] = useState("");

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearchForApi(value);
  }, DEBOUNCE_MS);

  const { data: agentsData, isLoading: loading } = useQuery({
    queryKey: ["agentsForRecipient", searchForApi],
    queryFn: async () => {
      const response = await getAgents({
        page: 1,
        limit: 20,
        sortBy: "SHARE_PRICE",
        sortOrder: "DESC",
        ...(searchForApi && { search: searchForApi }),
      });
      return response.data;
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`flex w-full items-center justify-between gap-2 rounded-lg px-4 py-3 h-11 text-left transition-all duration-200 ${
            hasError ? "bg-danger-muted-10" : "bg-neutral-02"
          }`}
        >
          <span className="text-label-sm font-medium truncate min-w-0">
            {selectedAgent ? (
              <>
                {selectedAgent.displayName || selectedAgent.username}
                <span className="text-neutral-tertiary font-normal ml-1">
                  @{selectedAgent.username}
                </span>
              </>
            ) : (
              <span className="text-neutral-tertiary">
                {loading ? "Loading..." : "Select agent"}
              </span>
            )}
          </span>
          <ChevronDown className="size-4 shrink-0 text-neutral-tertiary" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[var(--radix-dropdown-menu-trigger-width)] bg-neutral-02"
      >
        <div className="sticky top-0 z-10 p-1 pb-2 border-b border-neutral-03">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-tertiary" />
            <Input
              placeholder="Search agent..."
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                debouncedSetSearch(value.trim());
              }}
              onKeyDown={(e) => e.stopPropagation()}
              className="h-9 pl-9 pr-2 text-label-sm bg-transparent"
            />
          </div>
        </div>
        <div className="max-h-48 overflow-y-auto">
          {agentsData?.map((agent) => (
            <DropdownMenuItem
              key={agent.id}
              onClick={() => onSelect(agent)}
              className="cursor-pointer hover:bg-neutral-03 rounded-md"
            >
              <div className="flex flex-col items-start min-w-0">
                <span className="text-label-sm font-medium truncate w-full">
                  {agent.displayName || agent.username}
                </span>
                <span className="text-body-xs text-neutral-tertiary font-mono truncate w-full">
                  {formatAddress(agent.walletAddress)}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
          {(!agentsData || agentsData.length === 0) && !loading && (
            <div className="px-2 py-3 text-body-xs text-neutral-tertiary">
              {searchQuery.trim()
                ? "No agents match your search"
                : "No agents found"}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
