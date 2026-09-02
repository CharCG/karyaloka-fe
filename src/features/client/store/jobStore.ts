import { create } from "zustand";
import type { JobItem } from "../components/ProjectCard";
import type { OverviewData } from "../components/OverviewCard";

export interface NewProjectPayload {
  title: string;
  description: string;
  skills: string[];
  budget: string;
  deadline: string;
}

interface ClientJobState {
  overviewData: OverviewData;
  recentJobs: JobItem[];
  addProject: (payload: NewProjectPayload) => void;
}

const INITIAL_JOBS: JobItem[] = [
  {
    id: "job-1",
    title: "Mobile App Design",
    subtitle: "Dika Pratama",
    status: "in_progress",
    statusLabel: "In Progress",
    iconBgColor: "bg-blue-100 text-primary",
  },
  {
    id: "job-2",
    title: "Landing Page Design",
    subtitle: "Dika Pratama",
    status: "need_review",
    statusLabel: "Need Review",
    iconBgColor: "bg-emerald-100 text-emerald-600",
  },
];

export const useClientJobStore = create<ClientJobState>((set) => ({
  overviewData: {
    openCount: 3,
    activeCount: 2,
    completedCount: 8,
  },
  recentJobs: INITIAL_JOBS,
  addProject: (payload) => {
    const newJob: JobItem = {
      id: `job-${Date.now()}`,
      title: payload.title,
      subtitle: "0 interested • Just posted",
      status: "open",
      statusLabel: "Open",
      iconBgColor: "bg-blue-100 text-primary",
    };

    set((state) => ({
      recentJobs: [newJob, ...state.recentJobs],
      overviewData: {
        ...state.overviewData,
        openCount: state.overviewData.openCount + 1,
      },
    }));
  },
}));
