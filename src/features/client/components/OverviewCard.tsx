export interface OverviewData {
  openCount: number;
  activeCount: number;
  completedCount: number;
}

interface OverviewCardProps {
  data?: OverviewData;
  className?: string;
}

export default function OverviewCard({
  data = { openCount: 0, activeCount: 0, completedCount: 0 },
  className = "",
}: OverviewCardProps) {
  const stats = [
    { label: "Open", value: data.openCount },
    { label: "Active", value: data.activeCount },
    { label: "Completed", value: data.completedCount },
  ];

  return (
    <div className={`bg-background-surface rounded-lg p-4 border border-border flex flex-col gap-4 ${className}`}>
      <h2 className="text-body-lg font-semibold text-text-primary">Overview</h2>
      <div className="flex items-center justify-between">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center justify-center flex-1">
            <span className="text-body-sm text-text-secondary">{stat.label}</span>
            <span className="text-body-lg font-semibold text-text-primary mt-1">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
