import { useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import { useGetClientDashboard, type ClientDashboardProject } from "../api/projects";
import { useGetMe } from "../api/user";
import { storage } from "../../../shared/lib/storage";

import BottomNav from "../../../shared/components/BottomNav";
import HeaderBar from "../../../shared/components/HeaderBar";
import SectionHeader from "../../../shared/components/SectionHeader";
import OverviewCard from "../../../shared/components/OverviewCard";
import ProjectCard, { type ProjectItem } from "../../../shared/components/ProjectCard";
import FAB from "../../../shared/components/FAB";
import { type ProjectStatus } from "../../../shared/components/ProjectStatusBadge";

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

function mapToProjectItem(project: ClientDashboardProject, navigate: (path: string) => void): ProjectItem {
  const status = normalizeStatus(project.status);
  const applicantCount = project._count?.applications ?? 0;
  const freelancerName = project.assignedFreelancer?.user?.fullName;

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

export default function Home() {
  const navigate = useNavigate();
  const { data: user } = useGetMe();
  const storedUser = storage.getUser();
  const userName = user?.fullName || storedUser?.fullName || "User";

  const { data: dashboard, isLoading } = useGetClientDashboard();

  const overviewData = dashboard?.overview || {
    openCount: 0,
    activeCount: 0,
    completedCount: 0,
  };

  const needReviewProjects = dashboard?.needReviewProjects || [];
  const recentProjects = dashboard?.recentProjects || [];

  return (
    <div className="min-h-screen flex flex-col bg-background-base pb-32">
      <div className="bg-primary pt-4 pb-24">
        <HeaderBar title={`Hi, ${userName}! 👋`} variant="transparent" />
      </div>

      <div className="px-5 -mt-16 flex flex-col gap-8">
        <OverviewCard data={overviewData} isLoading={isLoading} />

        {isLoading ? (
          <div>
            <SectionHeader title="Recent Projects" />
            <div className="flex flex-col gap-3 mt-3">
              <Skeleton height={72} borderRadius={8} />
              <Skeleton height={72} borderRadius={8} />
            </div>
          </div>
        ) : (
          <>
            {needReviewProjects.length > 0 && (
              <div>
                <SectionHeader title="Needs Your Action" />
                <div className="flex flex-col gap-3 mt-3">
                  {needReviewProjects.map((p) => (
                    <ProjectCard key={p.id} project={mapToProjectItem(p, navigate)} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            <div>
              <SectionHeader
                title="Recent Projects"
                actionText="View All"
                onAction={() => navigate("/client/projects")}
              />
              {recentProjects.length > 0 ? (
                <div className="flex flex-col gap-3 mt-3">
                  {recentProjects.map((p) => (
                    <ProjectCard key={p.id} project={mapToProjectItem(p, navigate)} variant="compact" />
                  ))}
                </div>
              ) : (
                <div className="bg-background-surface rounded-lg p-6 border border-border text-center mt-3">
                  <p className="text-body-sm text-text-secondary">No recent projects posted.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <FAB to="/client/post-project" aria-label="Post a project" />
      <BottomNav role="client" />
    </div>
  );
}
