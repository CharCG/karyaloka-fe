export type ProjectStatus =
  | "open"
  | "closed"
  | "in_progress"
  | "submitted"
  | "need_review"
  | "completed"
  | "applied"
  | "rejected";

export interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  statusLabel?: string;
  className?: string;
}

export default function ProjectStatusBadge({ status, statusLabel, className = "" }: ProjectStatusBadgeProps) {
  const getStatusBadgeStyle = (s: ProjectStatus) => {
    switch (s) {
      case "open":
      case "completed":
        return "bg-success-bg text-success border-success-border";
      case "closed":
      case "rejected":
        return "bg-error-bg text-error border-error-border";
      case "in_progress":
      case "need_review":
        return "bg-warning-bg text-warning border-warning-border";
      case "applied":
      case "submitted":
        return "bg-info-bg text-info border-info-border";
      default:
        return "bg-background-base text-text-secondary border-border";
    }
  };

  const formatStatusText = (s: ProjectStatus, customLabel?: string) => {
    if (customLabel) return customLabel;
    switch (s) {
      case "open":
        return "Open";
      case "applied":
        return "Applied";
      case "rejected":
        return "Rejected";
      case "closed":
        return "Closed";
      case "in_progress":
        return "In Progress";
      case "submitted":
        return "Submitted";
      case "need_review":
        return "Need Review";
      case "completed":
        return "Completed";
      default:
        return s;
    }
  };

  return (
    <span
      className={`text-caption px-4 py-2 rounded-full border text-center ${getStatusBadgeStyle(status)} ${className}`.trim()}
    >
      {formatStatusText(status, statusLabel)}
    </span>
  );
}
