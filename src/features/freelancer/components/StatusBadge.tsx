export type ProjectStatus =
  | "applied"
  | "rejected"
  | "in_progress"
  | "submitted"
  | "completed";

export interface StatusBadgeProps {
  status: ProjectStatus;
  label?: string;
  className?: string;
}

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  applied: {
    label: "Applied",
    bg: "bg-success-bg",
    text: "text-success",
    border: "border-success-border",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-error-bg",
    text: "text-error",
    border: "border-error-border",
  },
  in_progress: {
    label: "In Progress",
    bg: "bg-warning-bg",
    text: "text-warning",
    border: "border-warning-border",
  },
  submitted: {
    label: "Submitted",
    bg: "bg-info-bg",
    text: "text-info",
    border: "border-info-border",
  },
  completed: {
    label: "Completed",
    bg: "bg-gray-100",
    text: "text-text-secondary",
    border: "border-gray-200",
  },
};

export default function StatusBadge({
  status,
  label,
  className = "",
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.applied;
  const displayLabel = label || config.label;

  return (
    <span
      className={`inline-flex items-center justify-center text-caption font-semibold px-2.5 py-1 rounded-full border shrink-0 leading-none ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {displayLabel}
    </span>
  );
}
