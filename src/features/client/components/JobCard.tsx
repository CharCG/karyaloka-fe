import type { ReactNode } from "react";

export type JobStatus = "in_progress" | "open" | "completed" | "review";

export interface JobItem {
  id: string;
  title: string;
  subtitle: string; // e.g. "Freelancer: Dika Pratama" or "5 interested"
  status: JobStatus;
  statusLabel?: string;
  icon?: ReactNode;
  iconBgColor?: string;
  onClick?: () => void;
}

interface JobCardProps {
  job: JobItem;
}

export default function JobCard({ job }: JobCardProps) {
  const getStatusBadgeStyle = (status: JobStatus) => {
    switch (status) {
      case "in_progress":
        return "bg-info-bg text-info border-info-border";
      case "open":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "completed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "review":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatStatusText = (status: JobStatus, customLabel?: string) => {
    if (customLabel) return customLabel;
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "open":
        return "Open";
      case "completed":
        return "Completed";
      case "review":
        return "In Review";
      default:
        return status;
    }
  };

  return (
    <div
      onClick={job.onClick}
      className="bg-background-surface rounded-2xl p-4 border border-border flex items-center justify-between gap-3 hover:border-primary/40 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Icon */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            job.iconBgColor || "bg-primary/10 text-primary"
          }`}
        >
          {job.icon || (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
              />
            </svg>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col min-w-0">
          <h3 className="text-body-sm font-bold text-text-primary truncate">
            {job.title}
          </h3>
          <p className="text-caption font-medium text-text-secondary truncate mt-0.5">
            {job.subtitle}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <span
        className={`shrink-0 text-caption font-semibold px-3 py-1 rounded-full border text-center ${getStatusBadgeStyle(
          job.status
        )}`}
      >
        {formatStatusText(job.status, job.statusLabel)}
      </span>
    </div>
  );
}
