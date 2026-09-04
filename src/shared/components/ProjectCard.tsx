import ProjectStatusBadge, { type ProjectStatus } from "./ProjectStatusBadge";
import ChevronRightIcon from "../../assets/icons/chevlon-right.svg?react";

export interface ProjectItem {
  id: string;
  title: string;
  status: ProjectStatus;
  statusLabel?: string;
  budget?: string | number;
  deadline?: string;
  applicantCount?: number;
  candidateCount?: number;
  assignedFreelancerName?: string;
  createdAt?: string;
  updatedAt?: string;
  onClick?: () => void;
}

export interface ProjectCardProps {
  project: ProjectItem;
  variant?: "compact" | "detailed";
  className?: string;
}

function formatBudget(budget?: number | string): string {
  if (budget === undefined || budget === null) return "";
  const num = typeof budget === "string" ? parseFloat(budget) : budget;
  if (isNaN(num)) return `Rp${budget}`;
  return `Rp${num.toLocaleString("id-ID")}`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatShortDate(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function ProjectCard({
  project,
  variant = "compact",
  className = "",
}: ProjectCardProps) {
  const isCompact = variant === "compact";

  if (isCompact) {
    return (
      <div
        onClick={project.onClick}
        className={`bg-background-surface rounded-lg p-4 border border-border flex items-center justify-between cursor-pointer active:bg-background-base/50 ${className}`.trim()}
      >
        <div className="flex flex-col gap-1 min-w-0 pr-3">
          <h3 className="text-body font-semibold text-text-primary truncate">{project.title}</h3>
          <span className="text-caption text-text-secondary">
            {project.status === "open" && (project.applicantCount !== undefined || project.candidateCount !== undefined)
              ? `${project.applicantCount ?? project.candidateCount} applicants`
              : project.assignedFreelancerName
              ? `Assigned: ${project.assignedFreelancerName}`
              : "Project details"}
          </span>
        </div>
        <ProjectStatusBadge
          status={project.status}
          statusLabel={project.statusLabel}
          className="shrink-0"
        />
      </div>
    );
  }

  const budgetText = formatBudget(project.budget);
  const deadlineText = formatDate(project.deadline);

  return (
    <div
      onClick={project.onClick}
      className={`bg-background-surface rounded-lg p-5 border border-border flex flex-col gap-3 cursor-pointer active:bg-background-base/50 ${className}`.trim()}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-body-lg font-semibold text-primary flex-1">{project.title}</h3>
        <ProjectStatusBadge
          status={project.status}
          statusLabel={project.statusLabel}
          className="shrink-0"
        />
      </div>

      {(budgetText || deadlineText) && (
        <p className="text-body-sm font-semibold text-text-primary">
          {budgetText}
          {budgetText && deadlineText ? " • " : ""}
          {deadlineText}
        </p>
      )}

      <p className="text-body-sm text-text-secondary">
        {project.assignedFreelancerName ||
          ((project.applicantCount !== undefined || project.candidateCount !== undefined)
            ? `${project.applicantCount ?? project.candidateCount} applicants`
            : "No freelancer assigned")}
      </p>

      <div className="flex items-center justify-between pt-1 text-caption text-text-tertiary">
        <span>{project.createdAt ? `Posted ${formatShortDate(project.createdAt)}` : ""}</span>
        <ChevronRightIcon className="w-4 h-4 text-text-tertiary" />
      </div>
    </div>
  );
}
