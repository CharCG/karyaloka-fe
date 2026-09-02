import ProjectStatusBadge, { type ProjectStatus } from "../../../shared/components/ProjectStatusBadge";

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  status: ProjectStatus;
  statusLabel?: string;
  onClick?: () => void;
}

interface ProjectCardProps {
  project: ProjectItem;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      onClick={project.onClick}
      className="bg-background-surface rounded-lg p-4 border border-border flex items-center justify-between hover:border-primary cursor-pointer"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-body font-semibold text-text-primary">{project.title}</h3>
        <p className="text-caption text-text-secondary">{project.subtitle}</p>
      </div>

      <ProjectStatusBadge status={project.status} statusLabel={project.statusLabel} />
    </div>
  );
}
