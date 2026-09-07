import { useState, useRef, type TouchEvent, type MouseEvent } from "react";
import type { DiscoverProject } from "../api/projects";

import XIcon from "../../../assets/icons/x.svg?react";
import HeartIcon from "../../../assets/icons/heart.svg?react";
import InfoIcon from "../../../assets/icons/info.svg?react";

export interface SwipeCardDeckProps {
  projects: DiscoverProject[];
  onSwipeRight: (project: DiscoverProject) => void;
  onSwipeLeft: (project: DiscoverProject) => void;
  onInfo: (project: DiscoverProject) => void;
  isLoading?: boolean;
}

function formatBudget(budget: number | string): string {
  const num = typeof budget === "string" ? parseFloat(budget) : budget;
  if (isNaN(num)) return `Rp${budget}`;
  return `Rp${num.toLocaleString("id-ID")}`;
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `Posted ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Posted ${days}d ago`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function SwipeCardDeck({
  projects,
  onSwipeRight,
  onSwipeLeft,
  onInfo,
  isLoading = false,
}: SwipeCardDeckProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const currentProject = projects[0];

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!currentProject) return;
    setIsDragging(true);
    startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startPos.current.x;
    const dy = e.touches[0].clientY - startPos.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleTouchEnd = () => {
    if (!isDragging || !currentProject) return;
    setIsDragging(false);

    if (dragOffset.x > 100) {
      onSwipeRight(currentProject);
    } else if (dragOffset.x < -100) {
      onSwipeLeft(currentProject);
    }
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!currentProject) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleMouseUp = () => {
    if (!isDragging || !currentProject) return;
    setIsDragging(false);

    if (dragOffset.x > 100) {
      onSwipeRight(currentProject);
    } else if (dragOffset.x < -100) {
      onSwipeLeft(currentProject);
    }
    setDragOffset({ x: 0, y: 0 });
  };

  const handleTriggerSwipeRight = () => {
    if (!currentProject) return;
    onSwipeRight(currentProject);
  };

  const handleTriggerSwipeLeft = () => {
    if (!currentProject) return;
    onSwipeLeft(currentProject);
  };

  const clientName = currentProject?.client?.user?.fullName || "Client Partner";
  const clientAvatar = currentProject?.client?.user?.profilePhotoUrl;
  const clientInitials = clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const visibleSkills = currentProject?.skills?.slice(0, 3) || [];
  const remainingSkillsCount = (currentProject?.skills?.length || 0) - visibleSkills.length;

  return (
    <div className="flex-1 flex flex-col items-center justify-between pb-8 pt-0">
      <div className="relative w-full max-w-[340px] h-[480px] flex items-center justify-center">
        {currentProject && (
          <div
            className="absolute inset-0 bg-[#5B88B2] rounded-2xl transform translate-x-5 rotate-3 scale-[0.92] pointer-events-none"
            style={{ zIndex: 1 }}
          />
        )}

        {currentProject && (
          <div
            className="absolute inset-0 bg-[#A8534C] rounded-2xl transform translate-x-2.5 rotate-1.5 scale-[0.96] pointer-events-none"
            style={{ zIndex: 2 }}
          />
        )}

        {isLoading ? (
          <div className="w-full h-full bg-[#1B2A4A] rounded-2xl p-6 flex flex-col justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20" />
              <div className="w-32 h-4 bg-white/20 rounded-lg" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-48 h-6 bg-white/20 rounded-lg" />
              <div className="w-24 h-4 bg-white/20 rounded-lg" />
              <div className="w-full h-16 bg-white/20 rounded-lg" />
            </div>
            <div className="w-full h-10 bg-white/20 rounded-lg" />
          </div>
        ) : !currentProject ? (
          <div className="w-full h-full bg-background-surface rounded-2xl border border-border p-8 flex flex-col items-center justify-center text-center gap-3">
            <h3 className="text-h3 font-semibold text-text-primary">All Caught Up!</h3>
            <p className="text-body-sm text-text-secondary leading-relaxed">Check back soon for new opportunities.</p>
          </div>
        ) : (
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full h-full bg-[#1B2A4A] text-white rounded-2xl p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none relative overflow-hidden"
            style={{
              zIndex: 10,
              transform: isDragging
                ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragOffset.x * 0.05}deg)`
                : "translate3d(0, 0, 0) rotate(0deg)",
            }}
          >
            {isDragging && dragOffset.x > 50 && (
              <div className="absolute top-6 right-6 border-2 border-success bg-success/20 text-success font-semibold px-4 py-1.5 rounded-lg text-sm rotate-12 uppercase tracking-wider">
                APPLY
              </div>
            )}

            {isDragging && dragOffset.x < -50 && (
              <div className="absolute top-6 left-6 border-2 border-error bg-error/20 text-error font-semibold px-4 py-1.5 rounded-lg text-sm -rotate-12 uppercase tracking-wider">
                SKIP
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {clientAvatar ? (
                  <img
                    src={clientAvatar}
                    alt={clientName}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold text-body-sm text-white">
                    {clientInitials}
                  </div>
                )}
                <span className="text-body font-semibold text-white/90">{clientName}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <h2 className="text-h2 font-semibold text-white leading-tight">{currentProject.title}</h2>
                <p className="text-h3 font-semibold text-white mt-1">{formatBudget(currentProject.budget)}</p>
              </div>

              <p className="text-body-sm text-white/80 leading-relaxed line-clamp-4">{currentProject.description}</p>

              {visibleSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {visibleSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white/10 rounded-lg text-caption text-white font-medium border border-white/15"
                    >
                      {skill}
                    </span>
                  ))}
                  {remainingSkillsCount > 0 && (
                    <span className="px-2.5 py-1 bg-white/10 rounded-lg text-caption text-white/80 font-medium border border-white/15">
                      +{remainingSkillsCount}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/15">
              <span className="text-caption text-white/70 font-medium">
                Deadline: {formatDate(currentProject.deadline)}
              </span>
              <span className="text-caption text-white/60">{formatTimeAgo(currentProject.createdAt)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          type="button"
          onClick={handleTriggerSwipeLeft}
          disabled={!currentProject}
          className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-background-base active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title="Skip Project"
          aria-label="Skip Project"
        >
          <XIcon className="w-6 h-6 text-background-base" />
        </button>

        <button
          type="button"
          onClick={() => currentProject && onInfo(currentProject)}
          disabled={!currentProject}
          className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-background-base active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title="Project Information"
          aria-label="Project Information"
        >
          <InfoIcon className="w-5 h-5 text-background-base" />
        </button>

        <button
          type="button"
          onClick={handleTriggerSwipeRight}
          disabled={!currentProject}
          className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-background-base active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title="Apply to Project"
          aria-label="Apply to Project"
        >
          <HeartIcon className="w-7 h-7 text-background-base" />
        </button>
      </div>
    </div>
  );
}
