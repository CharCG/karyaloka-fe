import { useState } from "react";
import BottomNav from "../../../shared/components/BottomNav";
import DiscoverHeader from "../components/DiscoverHeader";
import JobCardDeck from "../components/JobCardDeck";
import ActionButtons from "../components/ActionButtons";
import FilterPanel, { type FilterValues } from "../components/FilterPanel";
import { type JobPost } from "../components/JobCardItem";

const INITIAL_JOBS: JobPost[] = [
  {
    id: "job-101",
    clientName: "PixelCraft Studios",
    clientAvatar: "",
    title: "UI/UX Designer for SaaS Dashboard",
    employmentType: "Full-time • Remote",
    budgetRange: "$1,500–$2,000",
    description:
      "We're looking for a creative UI/UX designer to craft beautiful and intuitive dashboard experiences for our upcoming analytics product.",
    skills: ["Figma", "UI Design", "Dashboard", "Prototyping", "Design System"],
    postedTimeAgo: "Posted 2h ago",
    applicantCount: 5,
  },
  {
    id: "job-102",
    clientName: "AlphaTech Labs",
    clientAvatar: "",
    title: "Mobile App Developer (React Native / Flutter)",
    employmentType: "Contract • Remote",
    budgetRange: "$2,500–$3,500",
    description:
      "Build a scalable cross-platform mobile application with real-time notifications, location tracking, and seamless checkout flow.",
    skills: ["React Native", "Flutter", "TypeScript", "Redux", "Firebase"],
    postedTimeAgo: "Posted 4h ago",
    applicantCount: 8,
  },
  {
    id: "job-103",
    clientName: "Nova Branding Co.",
    clientAvatar: "",
    title: "Brand Identity & Design System",
    employmentType: "Part-time • Hybrid",
    budgetRange: "$1,200–$1,800",
    description:
      "Looking for a seasoned visual designer to revamp our complete brand guidelines, typography scale, icon sets, and social media templates.",
    skills: ["Illustrator", "Branding", "Logo Design", "Typography"],
    postedTimeAgo: "Posted 6h ago",
    applicantCount: 3,
  },
  {
    id: "job-104",
    clientName: "FlowMetrics Inc.",
    clientAvatar: "",
    title: "Fullstack Web App Developer",
    employmentType: "Full-time • Remote",
    budgetRange: "$3,000–$4,200",
    description:
      "Develop next-generation web dashboards with React 19, Tailwind CSS, Node.js backend, and PostgreSQL data layer.",
    skills: ["React", "Node.js", "PostgreSQL", "Tailwind CSS", "REST API"],
    postedTimeAgo: "Posted 1d ago",
    applicantCount: 12,
  },
];

export default function Discover() {
  const [jobs] = useState<JobPost[]>(INITIAL_JOBS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobPost | null>(null);

  const activeJob = jobs[currentIndex];

  const handleSwipeLeft = (job: JobPost) => {
    console.log("Passed job:", job.title);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSwipeRight = (job: JobPost) => {
    console.log("Applied / Liked job:", job.title);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleInfo = () => {
    if (activeJob) {
      setSelectedJobDetail(activeJob);
    }
  };

  const handleResetDeck = () => {
    setCurrentIndex(0);
  };

  const handleApplyFilter = (filters: FilterValues) => {
    console.log("Applied filters:", filters);
    // Can filter jobs list accordingly
    setCurrentIndex(0);
  };

  return (
    <div className="min-h-screen bg-background-base pb-28 flex flex-col justify-between">
      <div>
        {/* 1. Discover Top Bar */}
        <DiscoverHeader onFilterClick={() => setIsFilterOpen(true)} />

        {/* 2. Card Deck Container */}
        <main className="px-5 pt-4 max-w-md mx-auto w-full">
          <JobCardDeck
            jobs={jobs}
            currentIndex={currentIndex}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onReset={handleResetDeck}
          />
        </main>
      </div>

      {/* 3. Action Buttons (Pass, Info, Like) */}
      <div className="px-5 pb-6">
        <ActionButtons
          onPass={() => {
            if (activeJob) handleSwipeLeft(activeJob);
          }}
          onInfo={handleInfo}
          onLike={() => {
            if (activeJob) handleSwipeRight(activeJob);
          }}
          disabled={currentIndex >= jobs.length}
        />
      </div>

      {/* 4. Bottom Navigation */}
      <BottomNav role="freelancer" />

      {/* 5. Filter Panel Bottom Sheet */}
      <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={handleApplyFilter} />

      {/* 6. Job Detail Modal (Triggered by 'i' button) */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setSelectedJobDetail(null)} />
          <div className="relative w-full max-w-lg bg-background-surface rounded-t-3xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-caption font-bold uppercase tracking-wider text-primary bg-info-bg px-3 py-1 rounded-full">
                Job Overview
              </span>
              <button
                type="button"
                onClick={() => setSelectedJobDetail(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary hover:bg-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h2 className="text-h2 font-bold text-text-primary mb-1">{selectedJobDetail.title}</h2>
            <p className="text-body font-semibold text-text-secondary mb-3">
              {selectedJobDetail.clientName} • {selectedJobDetail.employmentType}
            </p>

            <div className="p-4 bg-gray-50 rounded-2xl border border-border mb-5">
              <span className="text-caption text-text-tertiary font-medium">Estimated Budget</span>
              <p className="text-h3 font-bold text-primary mt-0.5">{selectedJobDetail.budgetRange}</p>
            </div>

            <div className="mb-5">
              <h3 className="text-body font-bold text-text-primary mb-2">Job Description</h3>
              <p className="text-body-sm text-text-secondary leading-relaxed">{selectedJobDetail.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-body font-bold text-text-primary mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedJobDetail.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-body-sm font-medium text-text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  handleSwipeRight(selectedJobDetail);
                  setSelectedJobDetail(null);
                }}
                className="flex-1 py-3.5 bg-primary text-white rounded-xl font-bold text-body hover:bg-primary/95 transition-colors cursor-pointer"
              >
                Apply for Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
