import { useState } from "react";
import BottomNav from "../../../shared/components/NavigationBar";
import HomeHeader from "../components/HomeHeader";
import OverviewCard from "../components/OverviewCard";
import ActionItemCard, { type ActionItem } from "../components/ActionItemCard";
import JobCard from "../components/JobCard";
import SectionHeader from "../components/SectionHeader";
import FAB from "../components/FAB";
import { useClientJobStore } from "../store/jobStore";

export default function Home() {
  // Store-backed Overview Data & Recent Jobs
  const overviewData = useClientJobStore((state) => state.overviewData);
  const recentJobs = useClientJobStore((state) => state.recentJobs);

  // Mock Needs Your Action Items
  const [actionItems] = useState<ActionItem[]>([
    {
      id: "act-1",
      title: "Deliverable submitted",
      projectName: "Website Redesign",
      timeAgo: "Submitted 2 days ago",
      actionText: "Review",
      onAction: () => alert("Reviewing deliverable for Website Redesign"),
    },
  ]);

  return (
    <div className="min-h-screen bg-background-base pb-32">
      {/* 1. Header (Primary Blue with rounded bottom, no notification icon) */}
      <HomeHeader name="Sarah" />

      {/* Main Content Area overlapping the header */}
      <div className="px-5 -mt-8 space-y-6 relative z-10">
        {/* 2. Overview Floating Card */}
        <OverviewCard data={overviewData} />

        {/* 3. Section "Needs Your Action" */}
        {actionItems.length > 0 ? (
          <div>
            <SectionHeader title="Needs Your Action" />
            <div className="space-y-3">
              {actionItems.map((item) => (
                <ActionItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-background-surface rounded-2xl p-4 border border-border text-center">
            <p className="text-body-sm text-text-secondary">
              🎉 No pending actions right now. All caught up!
            </p>
          </div>
        )}

        {/* 4. Section "Recent Jobs" */}
        <div>
          <SectionHeader
            title="Recent Jobs"
            actionText="View all"
            onAction={() => console.log("View all jobs")}
          />
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>

      {/* 5. Floating Action Button (+) */}
      <FAB to="/client/post-project" />

      {/* 6. Bottom Navigation */}
      <BottomNav role="client" />
    </div>
  );
}
