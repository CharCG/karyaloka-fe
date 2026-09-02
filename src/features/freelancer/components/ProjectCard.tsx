import StatusBadge, { type ProjectStatus } from "./StatusBadge";

export interface FreelancerProject {
  id: string;
  title: string;
  budget: string;
  deadline: string;
  clientName: string;
  status: ProjectStatus;
  lastUpdated: string;
  rating?: number | null;
  description: string;
  skills: string[];
  postedDate?: string;
}

interface ProjectCardProps {
  project: FreelancerProject;
  onClick?: (project: FreelancerProject) => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const isCompleted = project.status === "completed";

  return (
    <div
      onClick={() => onClick?.(project)}
      className="bg-background-surface rounded-2xl p-4 border border-border flex flex-col gap-2 hover:border-primary/40 hover:shadow-xs transition-all duration-200 cursor-pointer select-none"
    >
      {/* Top Row: Job Title & Status Badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-body font-bold text-primary hover:underline line-clamp-1 flex-1 min-w-0">
          {project.title}
        </h3>
        <StatusBadge status={project.status} />
      </div>

      {/* Budget & Deadline Row */}
      <p className="text-body-sm font-normal text-text-secondary">
        <span className="text-text-primary font-semibold">{project.budget}</span>
        {" • "}
        <span>{project.deadline}</span>
      </p>

      {/* Client Name */}
      <p className="text-body-sm font-bold text-text-primary">
        {project.clientName}
      </p>

      {/* Bottom Row: Rating (if completed), Last Updated, Chevron */}
      <div className="border-t border-border pt-3 mt-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Rating (only visible for completed projects with rating) */}
          {isCompleted && typeof project.rating === "number" && (
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/80 px-2 py-0.5 rounded-md text-caption font-bold">
              <span>⭐</span>
              <span>{project.rating.toFixed(1)}</span>
            </div>
          )}

          <span className="text-caption text-text-tertiary">
            Last Updated {project.lastUpdated}
          </span>
        </div>

        {/* Chevron Arrow Icon */}
        <div className="text-text-tertiary flex items-center justify-center">
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
