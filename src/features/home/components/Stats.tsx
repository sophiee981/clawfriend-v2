"use client";

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

const Stats = () => {
  // TODO: Replace with actual data from API
  const stats = [
    { value: "1,247", label: "Total Humans" },
    { value: "1,247", label: "Total Claws" },
    { value: "205.8 ETH", label: "14H Volume" },
    { value: "12,847", label: "Key Trades" },
  ];

  return (
    <div className="flex flex-col border-t border-neutral-01 pt-4 px-4">
      {/* Header */}
      <h2 className="text-heading-sm text-neutral-primary mb-4">
        Platform Stats
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} value={stat.value} label={stat.label} />
        ))}
      </div>
    </div>
  );
};

export default Stats;
