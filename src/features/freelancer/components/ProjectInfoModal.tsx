import type { DiscoverProject } from "../api/projects";
import XIcon from "../../../assets/icons/x.svg?react";
import Button from "../../../shared/components/Button";

export interface ProjectInfoModalProps {
  project: DiscoverProject | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (project: DiscoverProject) => void;
}

function formatBudget(budget: number | string): string {
  const num = typeof budget === "string" ? parseFloat(budget) : budget;
  if (isNaN(num)) return `Rp${budget}`;
  return `Rp${num.toLocaleString("id-ID")}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProjectInfoModal({
  project,
  isOpen,
  onClose,
  onApply,
}: ProjectInfoModalProps) {
  if (!isOpen || !project) return null;

  const clientName = project.client?.user?.name || "Client Partner";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-background-surface rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-body-lg font-semibold text-text-primary">Project Overview</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center active:bg-background-base text-text-secondary cursor-pointer"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-4">
          <div>
            <h2 className="text-h3 font-semibold text-primary mb-1">{project.title}</h2>
            <p className="text-body-sm text-text-secondary">Posted by {clientName}</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-background-base rounded-lg border border-border">
            <div>
              <span className="text-caption text-text-secondary">Budget</span>
              <p className="text-body font-semibold text-text-primary">{formatBudget(project.budget)}</p>
            </div>
            <div className="text-right">
              <span className="text-caption text-text-secondary">Deadline</span>
              <p className="text-body font-semibold text-text-primary">{formatDate(project.deadline)}</p>
            </div>
          </div>

          <div>
            <h4 className="text-body-sm font-semibold text-text-primary mb-1">Description</h4>
            <p className="text-body-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {project.skills && project.skills.length > 0 && (
            <div>
              <h4 className="text-body-sm font-semibold text-text-primary mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-body-sm px-3.5 py-1.5 rounded-full border border-border bg-background-base text-text-secondary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              onApply(project);
              onClose();
            }}
            className="flex-1"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
