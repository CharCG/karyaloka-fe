import StatBlock from "./StatBlock";

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
  data = { openCount: 3, activeCount: 2, completedCount: 8 },
  className = "",
}: OverviewCardProps) {
  return (
    <div
      className={`bg-background-surface rounded-2xl p-4 shadow-sm border border-border/80 ${className}`}
    >
      <h2 className="text-body-sm font-bold text-text-primary mb-3">Overview</h2>
      <div className="flex items-center justify-between divide-x divide-border/60">
        <StatBlock label="Open" value={data.openCount} />
        <StatBlock label="Active" value={data.activeCount} />
        <StatBlock label="Completed" value={data.completedCount} />
      </div>
    </div>
  );
}
