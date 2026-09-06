import { useState } from "react";
import { useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import { useGetClientProjects, type ClientListProject } from "../api/projects";
import { type ProjectStatus } from "../../../shared/components/ProjectStatusBadge";

import BottomNav from "../../../shared/components/BottomNav";
import HeaderBar from "../../../shared/components/HeaderBar";
import ProjectCard, { type ProjectItem } from "../../../shared/components/ProjectCard";
import Input from "../../../shared/components/Input";

import SearchIcon from "../../../assets/icons/magnifying-glass.svg?react";

type ProjectTab = "all" | "active" | "completed";

const tabs: { key: ProjectTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

function normalizeStatus(rawStatus: string): ProjectStatus {
  const s = rawStatus.toLowerCase();
  if (s === "need_review") return "need_review";
  if (s === "in_progress") return "in_progress";
  if (s === "completed") return "completed";
  if (s === "closed") return "closed";
  if (s === "submitted") return "submitted";
  return "open";
}

function formatStatusLabel(rawStatus: string): string {
  const s = rawStatus.toLowerCase();
  if (s === "need_review") return "Submitted";
  if (s === "in_progress") return "In Progress";
  if (s === "completed") return "Completed";
  if (s === "closed") return "Closed";
  return "Open";
}

function mapToProjectItem(project: ClientListProject, navigate: (path: string) => void): ProjectItem {
  const status = normalizeStatus(project.status);
  const applicantCount = project._count?.applications ?? 0;
  const freelancerName = project.assignedFreelancer?.user?.name;

  return {
    id: project.id,
    title: project.title,
    status,
    statusLabel: formatStatusLabel(project.status),
    budget: project.budget,
    deadline: project.deadline,
    candidateCount: applicantCount,
    applicantCount,
    assignedFreelancerName: freelancerName,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    onClick: () => navigate(`/client/projects/${project.id}`),
  };
}

export default function Projects() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProjectTab>("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tabParam = activeTab === "all" ? undefined : activeTab;
  const { data: projects, isLoading } = useGetClientProjects(tabParam);

  const filteredProjects =
    projects?.filter((p) => p.title.toLowerCase().includes(searchQuery.trim().toLowerCase())) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background-base pb-24">
      <HeaderBar
        title="Projects"
        variant="surface"
        className="border-b-0"
        actionIcon={<SearchIcon className="w-8 h-8 text-primary" />}
        actionAriaLabel="Search projects"
        onActionClick={() => setIsSearchOpen((prev) => !prev)}
      />

      {isSearchOpen && (
        <div className="px-5 pb-2 bg-background-surface border-b-0">
          <Input
            placeholder="Search projects by title..."
            aria-label="Search projects by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
      )}

      <div className="w-full bg-background-surface border-b border-border flex items-center justify-around px-5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative py-4 px-6 text-body font-medium cursor-pointer text-center ${
                isActive ? "text-primary" : "text-text-secondary"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
            </button>
          );
        })}
      </div>

      <div className="px-5 py-5 flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-background-surface rounded-lg p-5 border border-border flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Skeleton width={140} height={20} borderRadius={4} />
                <Skeleton width={60} height={24} borderRadius={12} />
              </div>
              <Skeleton width={180} height={16} borderRadius={4} />
              <Skeleton width={120} height={14} borderRadius={4} />
              <div className="flex items-center justify-between mt-1">
                <Skeleton width={100} height={12} borderRadius={4} />
                <Skeleton width={16} height={16} borderRadius={4} />
              </div>
            </div>
          ))
        ) : filteredProjects.length === 0 ? (
          <div className="bg-background-surface rounded-lg p-8 border border-border text-center flex flex-col items-center justify-center gap-2 mt-4">
            <p className="text-body font-semibold text-text-primary">No projects found</p>
            <p className="text-body-sm text-text-secondary">
              {searchQuery
                ? "No projects match your search query."
                : activeTab === "all"
                  ? "You haven't posted any projects yet."
                  : activeTab === "active"
                    ? "You don't have any active projects."
                    : "You don't have any completed projects."}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={mapToProjectItem(project, navigate)} variant="detailed" />
          ))
        )}
      </div>

      <BottomNav role="client" />
    </div>
  );
}
