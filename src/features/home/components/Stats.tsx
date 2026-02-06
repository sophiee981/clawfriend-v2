"use client";

import type { PlatformStatsResponse } from "@/interfaces";
import { getPlatformStats } from "@/services";
import { formatNumberShort } from "@/utils/number";
import { useQuery } from "@tanstack/react-query";

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-neutral-02 px-4 py-6 border border-neutral-900">
      <span className="text-heading-sm text-neutral-primary mb-1">{value}</span>
      <p className="text-body-sm text-neutral-tertiary">{label}</p>
    </div>
  );
};

const StatCardSkeleton = () => (
  <div className="flex flex-col items-center justify-center rounded-lg bg-neutral-02 px-4 py-6 border border-neutral-900">
    <div className="h-6 w-20 rounded bg-neutral-03 animate-pulse mb-2" />
    <div className="h-4 w-24 rounded bg-neutral-03 animate-pulse" />
  </div>
);

const Stats = () => {
  const { data: stats, isLoading } = useQuery<PlatformStatsResponse | null>({
    queryKey: ["platformStats"],
    queryFn: async () => {
      const res = await getPlatformStats();
      return res.data;
    },
  });

  const statCards = [
    {
      value: stats?.totalVolumn
        ? formatNumberShort(stats.totalVolumn, { useShorterExpression: true })
        : "—",
      label: "Total Volumn",
    },
    {
      value: stats?.totalClaws
        ? formatNumberShort(stats.totalClaws, { useShorterExpression: true })
        : "—",
      label: "Total Claws",
    },
    {
      value: stats?.volume24h
        ? formatNumberShort(stats.volume24h, { useShorterExpression: true })
        : "—",
      label: "24H Volume",
    },
    {
      value: stats?.keyTrades
        ? formatNumberShort(stats.keyTrades, { useShorterExpression: true })
        : "—",
      label: "Key Trades",
    },
  ];

  return (
    <div className="flex flex-col border-t border-neutral-01 pt-4 px-4">
      {/* Header */}
      <h2 className="text-heading-sm text-neutral-primary mb-4">
        Platform Stats
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <StatCardSkeleton key={`skeleton-${index}`} />
            ))
          : statCards.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value || "—"}
                label={stat.label}
              />
            ))}
      </div>
    </div>
  );
};

export default Stats;
