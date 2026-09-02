import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import BottomNav from "../../../shared/components/NavigationBar";
import ProjectsHeader from "../components/ProjectsHeader";
import TabSwitcher, { type TabItem } from "../components/TabSwitcher";
import ProjectCard, { type FreelancerProject } from "../components/ProjectCard";
import { DUMMY_PROJECTS } from "../data/projectsData";

type TabKey = "all" | "active" | "completed";

export default function Projects() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Tab count indicators
  const tabs: TabItem<TabKey>[] = useMemo(() => {
    const activeCount = DUMMY_PROJECTS.filter(
      (p) => p.status === "in_progress" || p.status === "submitted"
    ).length;
    const completedCount = DUMMY_PROJECTS.filter(
      (p) => p.status === "completed"
    ).length;

    return [
      { key: "all", label: "All", count: DUMMY_PROJECTS.length },
      { key: "active", label: "Active", count: activeCount },
      { key: "completed", label: "Completed", count: completedCount },
    ];
  }, []);

  // Filter projects based on activeTab and search query
  const filteredProjects = useMemo(() => {
    return DUMMY_PROJECTS.filter((project) => {
      // Tab filter
      let matchesTab = true;
      if (activeTab === "active") {
        matchesTab =
          project.status === "in_progress" || project.status === "submitted";
      } else if (activeTab === "completed") {
        matchesTab = project.status === "completed";
      }

      // Search filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        project.title.toLowerCase().includes(query) ||
        project.clientName.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  // Navigate to project detail page
  const handleProjectCardClick = (project: FreelancerProject) => {
    navigate(`/freelancer/projects/${project.id}`, {
      state: { project },
    });
  };

  // Contextual empty state message
  const getEmptyStateContent = () => {
    if (searchQuery.trim() !== "") {
      return {
        title: "No matching projects",
        description: `We couldn't find any projects matching "${searchQuery}".`,
        actionLabel: "Clear Search",
        onAction: () => setSearchQuery(""),
      };
    }

    switch (activeTab) {
      case "active":
        return {
          title: "No active projects",
          description:
            "You don't have any ongoing or submitted projects right now.",
          actionLabel: "Explore Jobs",
          onAction: () => navigate("/freelancer"),
        };
      case "completed":
        return {
          title: "No completed projects yet",
          description:
            "Finished jobs and your client reviews will be archived here.",
          actionLabel: "Discover Projects",
          onAction: () => navigate("/freelancer"),
        };
      case "all":
      default:
        return {
          title: "No projects found",
          description:
            "You haven't applied to any projects yet. Start discovering opportunities!",
          actionLabel: "Find Jobs",
          onAction: () => navigate("/freelancer"),
        };
    }
  };

  const emptyState = getEmptyStateContent();

  return (
    <div className="min-h-screen bg-background-base pb-32 flex flex-col">
      {/* Sticky Header Section */}
      <header className="sticky top-0 z-30 bg-background-surface shadow-xs">
        <ProjectsHeader
          onSearchClick={() => setIsSearchOpen((prev) => !prev)}
          isSearchOpen={isSearchOpen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery("")}
        />

        <TabSwitcher<TabKey>
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-5 pt-4 max-w-md mx-auto w-full">
        {filteredProjects.length > 0 ? (
          <div className="flex flex-col gap-3 transition-opacity duration-200">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectCardClick(project)}
              />
            ))}
          </div>
        ) : (
          /* Contextual Empty State */
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-info-bg text-primary flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6A2.25 2.25 0 004.887 20.25h14.226a2.25 2.25 0 002.213-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                />
              </svg>
            </div>

            <h3 className="text-body font-bold text-text-primary mb-1">
              {emptyState.title}
            </h3>
            <p className="text-body-sm text-text-secondary max-w-xs mb-6">
              {emptyState.description}
            </p>

            <button
              type="button"
              onClick={emptyState.onAction}
              className="px-5 py-2.5 bg-primary text-white text-body-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer shadow-xs"
            >
              {emptyState.actionLabel}
            </button>
          </div>
        )}
      </main>

      {/* Reused Shared Bottom Navigation */}
      <BottomNav role="freelancer" />
    </div>
  );
}
