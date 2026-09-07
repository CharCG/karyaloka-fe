import { useState } from "react";
import { useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import { useGetFreelancerProjects, type FreelancerProject } from "../api/projects";
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

function getFreelancerProjectStatus(project: FreelancerProject): { status: ProjectStatus; label: string } {
  const projectStatus = (project.status || "").toUpperCase();
  const appStatus = (project.applicationStatus || "").toUpperCase();

  if (projectStatus === "COMPLETED") {
    return { status: "completed", label: "Completed" };
  }
  if (projectStatus === "NEED_REVIEW") {
    return { status: "need_review", label: "Need Review" };
  }
  if (projectStatus === "IN_PROGRESS") {
    return { status: "in_progress", label: "In Progress" };
  }
  if (appStatus === "REJECTED") {
    return { status: "rejected", label: "Rejected" };
  }
  if (appStatus === "WITHDRAWN") {
    return { status: "closed", label: "Withdrawn" };
  }
  if (projectStatus === "CLOSED") {
    return { status: "closed", label: "Closed" };
  }
  return { status: "applied", label: "Applied" };
}

function mapToProjectItem(project: FreelancerProject, navigate: (path: string) => void): ProjectItem {
  const { status, label } = getFreelancerProjectStatus(project);
  const clientName = project.client?.user?.name || "Client";

  return {
    id: project.id,
    title: project.title,
    status,
    statusLabel: label,
    budget: project.budget,
    deadline: project.deadline,
    assignedFreelancerName: `Client: ${clientName}`,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    onClick: () => navigate(`/freelancer/projects/${project.id}`),
  };
}

export default function Projects() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProjectTab>("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tabParam = activeTab === "all" ? undefined : activeTab;
  const { data: projects, isLoading } = useGetFreelancerProjects(tabParam);

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
                  ? "You don't have any assigned projects yet."
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

      <BottomNav role="freelancer" />
    </div>
  );
}
