import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import {
  useGetProjectDetail,
  useGetProjectApplications,
  useCloseProject,
  useApproveCompletion,
} from "../api/projects";
import { useGetOrCreateConversation } from "../api/conversation";
import { type ProjectStatus } from "../../../shared/components/ProjectStatusBadge";

import HeaderBar from "../../../shared/components/HeaderBar";
import ProjectStatusBadge from "../../../shared/components/ProjectStatusBadge";
import Button from "../../../shared/components/Button";
import SectionHeader from "../../../shared/components/SectionHeader";
import ChevronRightIcon from "../../../assets/icons/chevlon-right.svg?react";

function formatBudget(budget: number | string): string {
  const num = typeof budget === "string" ? parseFloat(budget) : budget;
  if (isNaN(num)) return `Rp${budget}`;
  return `Rp${num.toLocaleString("id-ID")}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatRating(rating: number | string): string {
  const num = typeof rating === "string" ? parseFloat(rating) : rating;
  if (isNaN(num) || num === 0) return "0.0";
  return num.toFixed(1);
}

function normalizeStatus(rawStatus: string): ProjectStatus {
  const s = rawStatus.toLowerCase();
  if (s === "in_progress") return "in_progress";
  if (s === "need_review") return "need_review";
  if (s === "completed") return "completed";
  if (s === "closed") return "closed";
  return "open";
}

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading } = useGetProjectDetail(projectId || "");
  const { data: candidateApps } = useGetProjectApplications(projectId || "");
  const closeProject = useCloseProject();
  const approveCompletion = useApproveCompletion();
  const getOrCreateConversation = useGetOrCreateConversation();

  const [rating, setRating] = useState(5);
  const [confirmSuccess, setConfirmSuccess] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const handleCandidateClick = async (userId: string) => {
    try {
      const conv = await getOrCreateConversation.mutateAsync(userId);
      navigate(`/client/messages/${conv.id}`);
    } catch {}
  };

  const handleClose = async () => {
    if (!projectId) return;
    try {
      await closeProject.mutateAsync(projectId);
      navigate("/client/projects");
    } catch {}
  };

  const handleApprove = async () => {
    if (!projectId) return;
    setConfirmError("");
    setConfirmSuccess("");
    try {
      await approveCompletion.mutateAsync({ projectId, rating });
      setConfirmSuccess("Deliverable approved and funds released to freelancer wallet!");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to approve completion";
      setConfirmError(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  if (isLoading || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-background-base pb-12">
        <HeaderBar title="Project Detail" showBack variant="surface" />
        <div className="px-5 py-6 flex flex-col gap-4">
          <Skeleton height={24} width="60%" borderRadius={4} />
          <Skeleton height={16} width="30%" borderRadius={4} />
          <Skeleton height={80} borderRadius={8} />
          <Skeleton height={16} width="50%" borderRadius={4} />
          <Skeleton height={16} width="40%" borderRadius={4} />
          <Skeleton height={48} borderRadius={8} className="mt-4" />
        </div>
      </div>
    );
  }

  const status = normalizeStatus(project.status);
  const applicants = candidateApps && candidateApps.length > 0 ? candidateApps : project.applications || [];
  const canClose = status === "open" && !project.assignedFreelancer;

  return (
    <div className="min-h-screen flex flex-col bg-background-base pb-12">
      <HeaderBar title="Project Detail" showBack variant="surface" />

      <div className="px-5 py-6">
        <div className="bg-background-surface rounded-lg p-5 border border-border flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-body-lg font-semibold text-primary flex-1">{project.title}</h2>
            <ProjectStatusBadge status={status} className="shrink-0" />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-body-sm font-semibold text-text-primary mb-1">Description</p>
              <p className="text-body text-text-secondary leading-relaxed">{project.description}</p>
            </div>

            <div>
              <p className="text-body-sm font-semibold text-text-primary mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-body-sm px-4 py-2 rounded-full border border-border text-text-secondary bg-background-base"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-body-sm font-semibold text-text-primary mb-1">Budget</p>
              <p className="text-body text-text-secondary">{formatBudget(project.budget)}</p>
            </div>

            <div>
              <p className="text-body-sm font-semibold text-text-primary mb-1">Deadline</p>
              <p className="text-body text-text-secondary">{formatDate(project.deadline)}</p>
            </div>

            <p className="text-caption text-text-tertiary">Posted {formatShortDate(project.createdAt)}</p>
          </div>

          {canClose && (
            <Button variant="danger-outline" onClick={handleClose} disabled={closeProject.isPending}>
              {closeProject.isPending ? "Cancelling..." : "Cancel"}
            </Button>
          )}
        </div>
      </div>

      {project.assignedFreelancer && (
        <div className="px-5 mb-6">
          <SectionHeader title="Assigned Freelancer" />
          <div className="bg-background-surface p-4 border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              {project.assignedFreelancer.user.avatarUrl ? (
                <img
                  src={project.assignedFreelancer.user.avatarUrl}
                  alt={project.assignedFreelancer.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-body font-semibold text-white">
                  {(project.assignedFreelancer.user.name || "F")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-body font-semibold text-text-primary">
                  {project.assignedFreelancer.user.name}
                </span>
                <span className="text-caption text-text-secondary">Assigned Freelancer</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCandidateClick(project.assignedFreelancer!.user.id)}
              className="px-4 py-2 border border-border rounded-lg text-body-sm font-semibold text-primary cursor-pointer active:bg-background-base"
            >
              Chat
            </button>
          </div>
        </div>
      )}

      {status === "in_progress" && (
        <div className="px-5 mb-6">
          <div className="bg-background-surface rounded-lg p-5 border border-border flex flex-col gap-2">
            <h4 className="text-body font-semibold text-text-primary">Work in Progress</h4>
            <p className="text-body-sm text-text-secondary leading-relaxed">
              The assigned freelancer is currently working on this project. You will receive the deliverable link here once submitted.
            </p>
          </div>
        </div>
      )}

      {status === "need_review" && (
        <div className="px-5 mb-6">
          <div className="bg-background-surface rounded-lg p-5 border border-border flex flex-col gap-4">
            <SectionHeader title="Review Deliverable" />

            <p className="text-body-sm text-text-secondary leading-relaxed">
              The freelancer has submitted the completed work for your review.
            </p>

            {project.deliverableUrl && (
              <div className="p-3 bg-background-base rounded-lg border border-border flex items-center justify-between">
                <span className="text-body-sm text-text-primary font-medium truncate max-w-[200px]">
                  {project.deliverableUrl}
                </span>
                <a
                  href={project.deliverableUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm font-semibold text-primary underline shrink-0"
                >
                  Open Work ↗
                </a>
              </div>
            )}

            {confirmError && (
              <div className="p-3 bg-error-bg text-error text-body-sm rounded-lg border border-error-border">
                {confirmError}
              </div>
            )}

            {confirmSuccess && (
              <div className="p-3 bg-success-bg text-success text-body-sm rounded-lg border border-success-border">
                {confirmSuccess}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-body-sm font-semibold text-text-primary">
                Rate Freelancer Work (1 - 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl cursor-pointer active:scale-95"
                  >
                    {star <= rating ? "⭐" : "☆"}
                  </button>
                ))}
                <span className="text-body-sm font-semibold text-text-primary ml-2">
                  {rating}.0
                </span>
              </div>
            </div>

            <Button
              onClick={handleApprove}
              disabled={approveCompletion.isPending}
            >
              {approveCompletion.isPending ? "Approving & Releasing..." : "Confirm & Release Payment"}
            </Button>
          </div>
        </div>
      )}

      {status === "completed" && (
        <div className="px-5 mb-6">
          <div className="bg-success-bg border border-success-border rounded-lg p-5 flex flex-col gap-2">
            <h4 className="text-body font-semibold text-success">Project Completed 🎉</h4>
            <p className="text-body-sm text-success leading-relaxed">
              You have approved this project. Funds have been released from escrow into the freelancer's wallet.
            </p>
            {project.deliverableUrl && (
              <a
                href={project.deliverableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-sm font-semibold text-primary underline mt-1"
              >
                View Approved Work ↗
              </a>
            )}
          </div>
        </div>
      )}

      {status === "open" && (
        <div className="px-5">
          <SectionHeader title={`Interested Candidates (${applicants.length})`} />

          {applicants.length === 0 ? (
            <div className="bg-background-surface rounded-lg p-6 border border-border text-center">
              <p className="text-body-sm text-text-secondary">No candidates have applied yet.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {applicants.map((app) => {
                const freelancer = app.freelancer;
                const user = freelancer.user;
                const applicantRating = freelancer.rating ?? 0;
                const completed = freelancer.completedCount ?? 0;
                const initials = (user.name || "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div
                    key={app.id}
                    onClick={() => navigate(`/client/projects/${project.id}/candidate/${user.id}?projectId=${project.id}`)}
                    className="bg-background-surface p-4 border border-border flex items-center justify-between first:rounded-t-lg last:rounded-b-lg -mt-[1px] first:mt-0 cursor-pointer active:bg-background-base/50"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-body-sm font-medium text-white shrink-0">
                          {initials}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-body font-semibold text-text-primary truncate">{user.name}</span>
                        <span className="text-caption text-text-secondary truncate">
                          ⭐ {formatRating(applicantRating)} • ({completed} Completed)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCandidateClick(user.id);
                        }}
                        className="px-3 py-1.5 border border-border rounded-lg text-body-sm font-semibold text-text-secondary cursor-pointer active:bg-background-base"
                      >
                        Chat
                      </button>
                      <ChevronRightIcon className="w-4 h-4 text-text-tertiary shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
