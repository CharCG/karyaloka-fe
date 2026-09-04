import { useState } from "react";
import { useGetDiscoverProjects, useApplyProject, useWithdrawApplication, type DiscoverProject } from "../api/projects";

import HeaderBar from "../../../shared/components/HeaderBar";
import BottomNav from "../../../shared/components/BottomNav";
import SwipeCardDeck from "../components/SwipeCardDeck";
import ProjectInfoModal from "../components/ProjectInfoModal";

interface SwipeHistoryItem {
  project: DiscoverProject;
  action: "apply" | "skip";
}

export default function Discover() {
  const { data, isLoading } = useGetDiscoverProjects(1, 20);
  const applyProjectMutation = useApplyProject();
  const withdrawApplicationMutation = useWithdrawApplication();

  const [swipedProjectIds, setSwipedProjectIds] = useState<string[]>([]);
  const [restoredProjects, setRestoredProjects] = useState<DiscoverProject[]>([]);
  const [selectedInfoProject, setSelectedInfoProject] = useState<DiscoverProject | null>(null);
  const [lastSwiped, setLastSwiped] = useState<SwipeHistoryItem | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const deck = [
    ...restoredProjects,
    ...(data?.projects?.filter(
      (p) => !swipedProjectIds.includes(p.id) && !restoredProjects.some((rp) => rp.id === p.id)
    ) || []),
  ];

  const handleSwipeRight = async (project: DiscoverProject) => {
    setSwipedProjectIds((prev) => [...prev, project.id]);
    setRestoredProjects((prev) => prev.filter((p) => p.id !== project.id));
    setLastSwiped({ project, action: "apply" });
    setToastMessage(`Applied to "${project.title}"`);

    try {
      await applyProjectMutation.mutateAsync(project.id);
    } catch {}
  };

  const handleSwipeLeft = (project: DiscoverProject) => {
    setSwipedProjectIds((prev) => [...prev, project.id]);
    setRestoredProjects((prev) => prev.filter((p) => p.id !== project.id));
    setLastSwiped({ project, action: "skip" });
    setToastMessage(`Skipped "${project.title}"`);
  };

  const handleUndo = async () => {
    if (!lastSwiped) return;

    const { project, action } = lastSwiped;
    setLastSwiped(null);
    setToastMessage("");

    setSwipedProjectIds((prev) => prev.filter((id) => id !== project.id));
    setRestoredProjects((prev) => [project, ...prev.filter((p) => p.id !== project.id)]);

    if (action === "apply") {
      try {
        await withdrawApplicationMutation.mutateAsync(project.id);
      } catch {}
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-base pb-28">
      <HeaderBar title="Discover" variant="surface" />

      <div className="flex-1 flex flex-col px-5 py-5">
        <SwipeCardDeck
          projects={deck}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onInfo={(p) => setSelectedInfoProject(p)}
          isLoading={isLoading}
        />
      </div>

      {lastSwiped && toastMessage && (
        <div className="fixed bottom-24 left-5 right-5 z-40 bg-text-primary text-white rounded-lg px-4 py-3 flex items-center justify-between animate-in fade-in slide-in-from-bottom duration-200">
          <span className="text-body-sm truncate mr-3">{toastMessage}</span>
          <button
            type="button"
            onClick={handleUndo}
            className="text-primary-light font-semibold text-body-sm underline cursor-pointer shrink-0 active:opacity-80"
          >
            Undo
          </button>
        </div>
      )}

      <ProjectInfoModal
        project={selectedInfoProject}
        isOpen={!!selectedInfoProject}
        onClose={() => setSelectedInfoProject(null)}
        onApply={handleSwipeRight}
      />

      <BottomNav role="freelancer" />
    </div>
  );
}
