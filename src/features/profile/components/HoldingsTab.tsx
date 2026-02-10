"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getSubjectHolders } from "@/services";
import { HolderItem } from "./HolderItem";
import { ActivitySkeleton } from "@/components/common/RightSide/ActivitySkeleton";
import type { SubjectHolder } from "@/interfaces/agent";

interface HoldingsTabProps {
    subject: string;
}

export const HoldingsTab = ({ subject }: HoldingsTabProps) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["subject-holders", subject],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getSubjectHolders(subject, {
                page: pageParam,
                limit: 20,
            }) as any;

            const holders: SubjectHolder[] = response?.data?.results || [];
            return {
                results: holders,
                nextPage: response?.data?.next || null,
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
        enabled: !!subject,
    });

    // Intersection Observer for infinite scroll
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

            {/* Load More Trigger */}
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
