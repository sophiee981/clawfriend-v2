"use client";

import { ActivitySkeleton } from "@/components/common/RightSide/ActivitySkeleton";
import { HolderItem } from "@/features/profile/components/HolderItem";
import type { SubjectHolder } from "@/interfaces/agent";
import { getSubjectHolders } from "@/services";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

interface WalletHoldingsTabProps {
  address: string;
}

export const WalletHoldingsTab = ({ address }: WalletHoldingsTabProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["subject-holders", address],
      queryFn: async ({ pageParam = 1 }) => {
        const response = (await getSubjectHolders(address, {
          page: pageParam,
          limit: 20,
        })) as any;

        const holders: SubjectHolder[] = response?.data?.results || [];
        return {
          results: holders,
          nextPage: response?.data?.next || null,
        };
      },
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
      enabled: !!address,
    });

  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allHolders = data?.pages.flatMap((page) => page.results) || [];

  if (isLoading) {
    return (
      <div className="w-full">
        <ActivitySkeleton count={5} />
      </div>
    );
  }

  if (allHolders.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 h-full">
        <p className="text-neutral-tertiary text-sm">No holders available</p>
      </div>
    );
  }

  return (
    <>
      {allHolders.map((holder: SubjectHolder) => (
        <HolderItem key={holder.walletAddress} holder={holder} />
      ))}

      {hasNextPage && (
        <div ref={loadMoreRef} className="py-4">
          {isFetchingNextPage && (
            <div className="w-full">
              <ActivitySkeleton count={2} />
            </div>
          )}
        </div>
      )}
    </>
  );
};
