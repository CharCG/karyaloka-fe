import { useState, useRef, type TouchEvent, type MouseEvent } from "react";
import JobCardItem, { type JobPost } from "./JobCardItem";

interface JobCardDeckProps {
  jobs: JobPost[];
  currentIndex: number;
  onSwipeLeft: (job: JobPost) => void;
  onSwipeRight: (job: JobPost) => void;
  onReset: () => void;
}

const STACK_COLORS = ["bg-[#1B2A4A]", "bg-[#8D4B38]", "bg-[#3D5A80]", "bg-[#284B63]"];

export default function JobCardDeck({
  jobs,
  currentIndex,
  onSwipeLeft,
  onSwipeRight,
  onReset,
}: JobCardDeckProps) {
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeJob = jobs[currentIndex];
  const nextJob1 = jobs[currentIndex + 1];
  const nextJob2 = jobs[currentIndex + 2];

  const handleTouchStart = (e: TouchEvent) => {
    if (!activeJob || exitDirection) return;
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !activeJob || exitDirection) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.x;
    const deltaY = touch.clientY - dragStartRef.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging || !activeJob || exitDirection) return;
    setIsDragging(false);

    const threshold = 100;
    if (dragOffset.x > threshold) {
      triggerSwipe("right");
    } else if (dragOffset.x < -threshold) {
      triggerSwipe("left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Mouse drag support for desktop/testing
  const handleMouseDown = (e: MouseEvent) => {
    if (!activeJob || exitDirection) return;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !activeJob || exitDirection) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging || !activeJob || exitDirection) return;
    setIsDragging(false);

    const threshold = 100;
    if (dragOffset.x > threshold) {
      triggerSwipe("right");
    } else if (dragOffset.x < -threshold) {
      triggerSwipe("left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const triggerSwipe = (direction: "left" | "right") => {
    setExitDirection(direction);
    const targetX = direction === "right" ? 500 : -500;
    setDragOffset({ x: targetX, y: 0 });

    setTimeout(() => {
      if (direction === "right") {
        onSwipeRight(activeJob);
      } else {
        onSwipeLeft(activeJob);
      }
      setDragOffset({ x: 0, y: 0 });
      setExitDirection(null);
    }, 280);
  };

  // If no more jobs in the deck, show empty state
  if (currentIndex >= jobs.length || !activeJob) {
    return (
      <div className="w-full h-[470px] bg-background-surface border border-border rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-info-bg text-primary flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-h3 font-bold text-text-primary mb-1">All Caught Up! 🎉</h3>
        <p className="text-body-sm text-text-secondary mb-6 max-w-xs">
          You have reviewed all available projects for now. Check back later or reset to explore again.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-3 bg-primary text-white rounded-xl font-semibold text-body-sm hover:bg-primary/90 transition-colors cursor-pointer active:scale-95"
        >
          Reset Job Deck
        </button>
      </div>
    );
  }

  // Calculate rotation and overlay opacity based on drag distance
  const rotation = dragOffset.x * 0.08; // degrees
  const likeOpacity = Math.min(Math.max(dragOffset.x / 100, 0), 1);
  const passOpacity = Math.min(Math.max(-dragOffset.x / 100, 0), 1);

  return (
    <div
      className="relative w-full h-[470px] select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3rd Card in Stack (deepest background) */}
      {nextJob2 && (
        <div
          className="absolute inset-0 transition-transform duration-300 pointer-events-none"
          style={{
            transform: "translateY(18px) scale(0.90) rotate(4deg)",
            transformOrigin: "bottom center",
            zIndex: 1,
            opacity: 0.7,
          }}
        >
          <JobCardItem
            job={nextJob2}
            cardBgColor={STACK_COLORS[2 % STACK_COLORS.length]}
          />
        </div>
      )}

      {/* 2nd Card in Stack (middle background) */}
      {nextJob1 && (
        <div
          className="absolute inset-0 transition-transform duration-300 pointer-events-none"
          style={{
            transform: "translateY(9px) scale(0.95) rotate(2deg)",
            transformOrigin: "bottom center",
            zIndex: 2,
            opacity: 0.9,
          }}
        >
          <JobCardItem
            job={nextJob1}
            cardBgColor={STACK_COLORS[1 % STACK_COLORS.length]}
          />
        </div>
      )}

      {/* 1st Card in Stack (Front Active Card with Swipe Gesture) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate3d(${dragOffset.x}px, ${dragOffset.y * 0.3}px, 0) rotate(${rotation}deg)`,
          transition: isDragging ? "none" : "transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)",
          zIndex: 10,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        className="absolute inset-0"
      >
        <JobCardItem job={activeJob} cardBgColor="bg-[#1B2A4A]" />

        {/* Swipe Right Overlay (LIKE / APPLY) */}
        {likeOpacity > 0.1 && (
          <div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 right-6 border-4 border-emerald-400 text-emerald-400 font-extrabold text-h2 px-4 py-1.5 rounded-2xl rotate-12 bg-emerald-950/40 backdrop-blur-sm pointer-events-none"
          >
            INTERESTED
          </div>
        )}

        {/* Swipe Left Overlay (PASS / SKIP) */}
        {passOpacity > 0.1 && (
          <div
            style={{ opacity: passOpacity }}
            className="absolute top-6 left-6 border-4 border-rose-400 text-rose-400 font-extrabold text-h2 px-4 py-1.5 rounded-2xl -rotate-12 bg-rose-950/40 backdrop-blur-sm pointer-events-none"
          >
            PASS
          </div>
        )}
      </div>
    </div>
  );
}
