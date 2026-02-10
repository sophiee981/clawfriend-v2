"use client";

import { BackButton } from "@/components/common/BackButton";
import { MagnifyingGlass, XMark } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
  hideBackButton?: boolean;
  inputClassName?: string;
}

export const SearchInput = ({
  value,
  onChange,
  onSearch,
  className,
  placeholder,
  hideBackButton,
  inputClassName,
}: SearchInputProps) => {
  return (
    <div className={cn("border-b border-neutral-01 px-4 py-2 sm :py-4 flex items-center gap-2", className)}>
      <div className={cn("sm:hidden", hideBackButton ? "hidden" : "")}>
        <BackButton />
      </div>
      <div className="relative flex-1">
        <MagnifyingGlass className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-tertiary" />
        <Input
          type="text"
          placeholder={placeholder || "Search by profile"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              onSearch(value);
            }
          }}
          className={cn(
            "pl-11 placeholder:text-[#717171] w-full bg-[#1b1b1b] max-sm:h-9 max-sm:placeholder:text-[14px] max-sm:rounded-[8px]",
            value ? "pr-11" : "pr-4",
            inputClassName
          )}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              onSearch("");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-tertiary hover:text-neutral-primary transition-colors"
            aria-label="Clear search"
          >
            <XMark className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
