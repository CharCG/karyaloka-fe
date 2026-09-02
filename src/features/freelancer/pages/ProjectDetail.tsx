import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import BackButton from "../../../shared/components/IconButton";
import BottomNav from "../../../shared/components/BottomNav";
import StatusBadge from "../components/StatusBadge";
import { type FreelancerProject } from "../components/ProjectCard";
import { DUMMY_PROJECTS } from "../data/projectsData";

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [deliverableLink, setDeliverableLink] = useState("");
  const [deliverableNotes, setDeliverableNotes] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Retrieve project from location state or fallback to lookup in DUMMY_PROJECTS
  const project: FreelancerProject | undefined =
    (location.state as { project?: FreelancerProject } | null)?.project ||
    DUMMY_PROJECTS.find((p) => p.id === projectId);

  const handleGoBack = () => {
    navigate("/freelancer/projects");
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setIsSubmitModalOpen(false);
      setDeliverableLink("");
      setDeliverableNotes("");
    }, 1500);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background-base flex flex-col justify-between">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background-surface pt-12 pb-3 px-5 border-b border-border/40 shadow-xs">
          <div className="flex items-center gap-3">
            <BackButton variant="surface" onClick={handleGoBack} aria-label="Back to projects" />
            <h1 className="text-h3 font-bold text-text-primary">Project Detail</h1>
          </div>
        </header>

        {/* Not Found State */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-error-bg text-error flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-h3 font-bold text-text-primary mb-2">Project Not Found</h2>
          <p className="text-body-sm text-text-secondary mb-6 max-w-xs">
            The project you are looking for does not exist or has been removed.
          </p>
          <button
            type="button"
            onClick={handleGoBack}
            className="px-5 py-2.5 bg-primary text-white text-body-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Back to Projects
          </button>
        </main>

        <BottomNav role="freelancer" />
      </div>
    );
  }

  const isCompleted = project.status === "completed";
  const isInProgress = project.status === "in_progress";
  const isRejected = project.status === "rejected";

  return (
    <div className="min-h-screen bg-background-base pb-32 flex flex-col">
      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-30 bg-background-surface pt-12 pb-3 px-5 border-b border-border/40 shadow-xs">
        <div className="flex items-center gap-3">
          <BackButton variant="surface" onClick={handleGoBack} aria-label="Back to projects" />
          <h1 className="text-h3 font-bold text-text-primary">Project Detail</h1>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 px-5 pt-5 max-w-md mx-auto w-full">
        <div className="bg-background-surface rounded-2xl p-6 border border-border shadow-xs flex flex-col divide-y divide-border/60">
          {/* Header Row: Title & Status Badge */}
          <div className="pb-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-h3 font-bold text-primary flex-1 min-w-0">{project.title}</h2>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-body-sm font-semibold text-text-secondary mt-1.5">
              Client: <span className="text-text-primary">{project.clientName}</span>
            </p>
          </div>

          {/* IMPROVEMENT: In Progress Status Banner */}
          {isInProgress && (
            <div className="py-4">
              <div className="p-4 bg-warning-bg rounded-2xl border border-warning-border">
                <div className="flex items-center gap-2 text-warning mb-2">
                  <svg
                    className="w-5 h-5 animate-pulse shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-caption font-bold uppercase tracking-wider">Active Project in Progress</span>
                </div>
                <p className="text-body-sm text-amber-950 font-medium leading-snug">
                  You are currently actively working on this project. Make sure all deliverables are submitted before
                  the deadline ({project.deadline}).
                </p>
              </div>

              {/* Action Buttons for in_progress */}
              <div className="flex items-center gap-2.5 mt-3.5">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="flex-1 py-3 px-4 bg-primary text-white text-body-sm font-semibold rounded-xl hover:bg-primary/95 transition-colors cursor-pointer text-center shadow-xs"
                >
                  Submit Deliverable
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/freelancer/messages")}
                  className="py-3 px-4 bg-background-base text-text-primary border border-border text-body-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                >
                  Chat Client
                </button>
              </div>
            </div>
          )}

          {/* IMPROVEMENT: Rejected Status Notice */}
          {isRejected && (
            <div className="py-4">
              <div className="p-4 bg-error-bg rounded-2xl border border-error-border">
                <div className="flex items-center gap-2 text-error mb-2">
                  <svg
                    className="w-5 h-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                  <span className="text-caption font-bold uppercase tracking-wider">Application Not Selected</span>
                </div>
                <p className="text-body-sm text-red-950 font-medium leading-relaxed">
                  The client has decided to proceed with another applicant for this role. Don't be discouraged — there
                  are many open opportunities that match your skill set!
                </p>
              </div>

              {/* Action Button for rejected */}
              <div className="mt-3.5">
                <button
                  type="button"
                  onClick={() => navigate("/freelancer")}
                  className="w-full py-3 px-4 bg-primary text-white text-body-sm font-semibold rounded-xl hover:bg-primary/95 transition-colors cursor-pointer text-center shadow-xs"
                >
                  Find Other Opportunities
                </button>
              </div>
            </div>
          )}

          {/* Section: Description */}
          <div className="py-4">
            <h3 className="text-body font-semibold text-text-primary mb-1.5">Description</h3>
            <p className="text-body-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Section: Skills */}
          {project.skills && project.skills.length > 0 && (
            <div className="py-4">
              <h3 className="text-body font-semibold text-text-primary mb-2.5">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 border border-gray-200/80 rounded-full text-caption font-medium text-text-secondary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section: Budget */}
          <div className="py-4">
            <h3 className="text-body font-semibold text-text-primary mb-1">Budget</h3>
            <p className="text-h3 font-bold text-primary">{project.budget}</p>
          </div>

          {/* Section: Deadline */}
          <div className="py-4">
            <h3 className="text-body font-semibold text-text-primary mb-1">Deadline</h3>
            <p className="text-body text-text-secondary font-medium">{project.deadline}</p>
          </div>

          {/* Section: Client Rating & Review (for completed projects) */}
          {isCompleted && typeof project.rating === "number" && (
            <div className="py-4">
              <h3 className="text-body font-semibold text-text-primary mb-2">Client Review</h3>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-caption text-amber-800 font-semibold uppercase tracking-wider">Rating</span>
                  <p className="text-body-sm text-amber-950 font-medium mt-0.5">
                    "Great collaboration, highly recommended!"
                  </p>
                </div>
                <div className="flex items-center gap-1 font-bold text-h3 text-amber-700 shrink-0 ml-3">
                  <span>⭐</span>
                  <span>{project.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Metadata Footer: Posted Date & Last Updated */}
          <div className="pt-4 flex flex-col gap-1 text-caption text-text-tertiary">
            {project.postedDate && <p>Posted {project.postedDate}</p>}
            <p>Last Updated {project.lastUpdated}</p>
          </div>
        </div>
      </main>

      {/* Submit Deliverable Modal for in_progress */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setIsSubmitModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-background-surface rounded-t-3xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-bold text-text-primary">Submit Deliverables</h3>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary hover:bg-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isSubmittedSuccess ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-success-bg text-success flex items-center justify-center mb-3">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-body font-bold text-text-primary mb-1">Deliverable Submitted!</h4>
                <p className="text-body-sm text-text-secondary">
                  Your work has been submitted to the client for review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitDeliverable} className="flex flex-col gap-4">
                <div>
                  <label className="block text-body-sm font-semibold text-text-primary mb-1">
                    Project Deliverable Link (Figma, GitHub, Drive)
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={deliverableLink}
                    onChange={(e) => setDeliverableLink(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background-base border border-border rounded-xl text-body-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-body-sm font-semibold text-text-primary mb-1">Notes for Client</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what has been completed, key notes, or instructions for review..."
                    value={deliverableNotes}
                    onChange={(e) => setDeliverableNotes(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background-base border border-border rounded-xl text-body-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="flex-1 py-3 bg-background-base border border-border text-text-secondary rounded-xl font-semibold text-body-sm hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold text-body-sm hover:bg-primary/95 transition-colors cursor-pointer shadow-xs"
                  >
                    Submit Work
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Reused Shared Bottom Navigation */}
      <BottomNav role="freelancer" />
    </div>
  );
}
