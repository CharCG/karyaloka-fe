import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import { useGetFreelancerProjectDetail, useWithdrawApplication, useSubmitDeliverable } from "../api/projects";
import { useGetOrCreateConversation } from "../../client/api/conversation";
import { type ProjectStatus } from "../../../shared/components/ProjectStatusBadge";

import HeaderBar from "../../../shared/components/HeaderBar";
import ProjectStatusBadge from "../../../shared/components/ProjectStatusBadge";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import SectionHeader from "../../../shared/components/SectionHeader";

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

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading } = useGetFreelancerProjectDetail(projectId || "");
  const withdrawMutation = useWithdrawApplication();
  const submitDeliverableMutation = useSubmitDeliverable();
  const getOrCreateConversation = useGetOrCreateConversation();

  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (isLoading || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-background-base pb-12">
        <HeaderBar title="Project Detail" showBack variant="surface" />
        <div className="px-5 py-5 flex flex-col gap-4">
          <Skeleton height={24} width="60%" borderRadius={8} />
          <Skeleton height={16} width="30%" borderRadius={8} />
          <Skeleton height={100} borderRadius={8} />
          <Skeleton height={16} width="50%" borderRadius={8} />
          <Skeleton height={48} borderRadius={8} className="mt-4" />
        </div>
      </div>
    );
  }

  const client = project.client?.user;
  const clientName = client?.name || "Client";
  const clientInitials = clientName
    .split(" ")
    .map((n: any) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const rawStatus = (project.status || "").toUpperCase();
  const appStatus = ((project as any).myApplication?.status || project.applicationStatus || "").toUpperCase();

  const isCompleted = rawStatus === "COMPLETED";
  const isSubmitted = rawStatus === "NEED_REVIEW";
  const isInProgress = rawStatus === "IN_PROGRESS";
  const isRejected = appStatus === "REJECTED";
  const isApplied = rawStatus === "OPEN" && appStatus === "APPLIED";

  let statusBadge: ProjectStatus = "applied";
  let statusLabel = "Applied";

  if (isCompleted) {
    statusBadge = "completed";
    statusLabel = "Completed";
  } else if (isSubmitted) {
    statusBadge = "need_review";
    statusLabel = "Need Review";
  } else if (isInProgress) {
    statusBadge = "in_progress";
    statusLabel = "In Progress";
  } else if (isRejected) {
    statusBadge = "rejected";
    statusLabel = "Rejected";
  } else if (rawStatus === "CLOSED") {
    statusBadge = "closed";
    statusLabel = "Closed";
  }

  const handleWithdraw = async () => {
    if (!projectId) return;
    try {
      await withdrawMutation.mutateAsync(projectId);
      navigate("/freelancer/projects");
    } catch {}
  };

  const handleChat = async () => {
    const targetUserId = client?.id || (project.client as any)?.userId;
    if (!targetUserId) {
      setError("Unable to start chat: client information not found.");
      return;
    }
    try {
      setError("");
      const conv = await getOrCreateConversation.mutateAsync(targetUserId);
      navigate(`/freelancer/messages/${conv.id}`);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to open chat.";
      setError(Array.isArray(message) ? message[0] : message);
    }
  };

  const handleSubmitDeliverable = async () => {
    if (!projectId || !deliverableUrl.trim()) {
      setError("Please provide a valid deliverable URL (e.g. Google Drive, Figma, GitHub link).");
      return;
    }

    try {
      setError("");
      await submitDeliverableMutation.mutateAsync({
        projectId,
        deliverableUrl: deliverableUrl.trim(),
      });
      setSuccessMessage("Deliverable submitted successfully! Awaiting client approval.");
    } catch (err: any) {
      const message = err.response?.data?.message;
      setError(Array.isArray(message) ? message[0] : message || "Failed to submit deliverable.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-base pb-12">
      <HeaderBar title="Project Detail" showBack variant="surface" />

      <div className="px-5 py-5 flex flex-col gap-4">
        {error && (
          <div className="p-4 text-body-sm text-error bg-error-bg border border-error-border rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-4 text-body-sm text-success bg-success-bg border border-success-border rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="bg-background-surface rounded-lg p-5 border border-border flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-body-lg font-semibold text-primary flex-1">{project.title}</h2>
            <ProjectStatusBadge status={statusBadge} statusLabel={statusLabel} className="shrink-0" />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-body-sm font-semibold text-text-primary mb-1">Description</p>
              <p className="text-body text-text-secondary leading-relaxed">{project.description}</p>
            </div>

            {project.skills && project.skills.length > 0 && (
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
            )}

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
        </div>

        {client && (
          <div className="bg-background-surface p-4 border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              {client.avatarUrl ? (
                <img
                  src={client.avatarUrl}
                  alt={clientName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-body font-semibold text-white">
                  {clientInitials}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-body font-semibold text-text-primary">{clientName}</span>
                <span className="text-caption text-text-secondary">Project Client</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleChat}
              disabled={getOrCreateConversation.isPending}
              className="px-4 py-2 border border-border rounded-lg text-body-sm font-semibold text-primary cursor-pointer active:bg-background-base disabled:opacity-50"
            >
              {getOrCreateConversation.isPending ? "Opening..." : "Chat"}
            </button>
          </div>
        )}

        {isInProgress && (
          <div className="bg-background-surface rounded-lg p-5 border border-border flex flex-col gap-4">
            <SectionHeader title="Submit Deliverable" />
            <p className="text-body-sm text-text-secondary">
              Provide a link to your completed work (e.g., Google Drive, Figma, GitHub, Dropbox).
            </p>

            <Input
              label="Deliverable URL"
              placeholder="https://..."
              value={deliverableUrl}
              onChange={(e) => setDeliverableUrl(e.target.value)}
              requiredMark
            />

            <Button
              onClick={handleSubmitDeliverable}
              disabled={submitDeliverableMutation.isPending}
            >
              {submitDeliverableMutation.isPending ? "Submitting..." : "Submit Deliverable"}
            </Button>
          </div>
        )}

        {isSubmitted && (
          <div className="bg-info-bg/40 border border-info-border rounded-lg p-5 flex flex-col gap-2">
            <h4 className="text-body font-semibold text-text-primary">Deliverable Under Review</h4>
            <p className="text-body-sm text-text-secondary leading-relaxed">
              Your submission has been sent to the client for approval. Once approved, the funds will be released to your wallet.
            </p>
            {project.deliverableUrl && (
              <a
                href={project.deliverableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-sm font-semibold text-primary underline mt-1"
              >
                View Submitted Deliverable ↗
              </a>
            )}
          </div>
        )}

        {isCompleted && (
          <div className="bg-success-bg border border-success-border rounded-lg p-5 flex flex-col gap-2">
            <h4 className="text-body font-semibold text-success">Project Completed 🎉</h4>
            <p className="text-body-sm text-success leading-relaxed">
              The client has approved your work. Payment has been released into your wallet.
            </p>
          </div>
        )}

        {isApplied && (
          <Button
            variant="danger-outline"
            onClick={handleWithdraw}
            disabled={withdrawMutation.isPending}
          >
            {withdrawMutation.isPending ? "Withdrawing..." : "Withdraw Application"}
          </Button>
        )}
      </div>
    </div>
  );
}
