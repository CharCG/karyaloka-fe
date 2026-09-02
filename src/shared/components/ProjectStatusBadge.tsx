export type ProjectStatus = "open" | "closed" | "in_progress" | "submitted" | "need_review";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  statusLabel?: string;
  className?: string;
}

export default function ProjectStatusBadge({ status, statusLabel, className = "" }: ProjectStatusBadgeProps) {
  const getStatusBadgeStyle = (s: ProjectStatus) => {
    switch (s) {
      case "open":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "closed":
        return "bg-slate-100 text-slate-600 border-slate-200/60";
      case "in_progress":
        return "bg-info-bg text-info border-info-border";
      case "submitted":
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      case "need_review":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200/60";
    }
  };

  const formatStatusText = (s: ProjectStatus, customLabel?: string) => {
    if (customLabel) return customLabel;
    switch (s) {
      case "open":
        return "Open";
      case "closed":
        return "Closed";
      case "in_progress":
        return "In Progress";
      case "submitted":
        return "Submitted";
      case "need_review":
        return "Need Review";
      default:
        return s;
    }
  };

  return (
    <span
      className={`text-caption px-4 py-2 rounded-full border text-center ${getStatusBadgeStyle(status)} ${className}`}
    >
      {formatStatusText(status, statusLabel)}
    </span>
  );
}
