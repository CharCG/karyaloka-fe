import Skeleton from "react-loading-skeleton";

export interface OverviewData {
  openCount: number;
  activeCount: number;
  completedCount: number;
}

export interface StatItem {
  label: string;
  value: string | number;
}

export interface OverviewCardProps {
  data?: OverviewData;
  stats?: StatItem[];
  showTitle?: boolean;
  title?: string;
  isLoading?: boolean;
  className?: string;
}

export default function OverviewCard({
  data = { openCount: 0, activeCount: 0, completedCount: 0 },
  stats,
  showTitle = true,
  title = "Overview",
  isLoading = false,
  className = "",
}: OverviewCardProps) {
  const displayStats: StatItem[] = stats || [
    { label: "Open", value: data.openCount },
    { label: "Active", value: data.activeCount },
    { label: "Completed", value: data.completedCount },
  ];

  return (
    <div
      className={`bg-background-surface rounded-lg p-4 border border-border flex flex-col ${showTitle ? "gap-4" : ""} ${className}`.trim()}
    >
      {showTitle && <h2 className="text-body-lg font-semibold text-text-primary">{title}</h2>}
      <div className="flex items-center justify-between">
        {displayStats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center flex-1">
            <span className="text-body-sm text-text-secondary">{stat.label}</span>
            <span className="text-body-lg font-semibold text-text-primary mt-1">
              {isLoading ? <Skeleton width={48} height={24} borderRadius={4} /> : stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
