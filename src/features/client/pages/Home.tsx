import { useClientJobStore } from "../store/jobStore";

import BottomNav from "../../../shared/components/BottomNav";
import HeaderBar from "../../../shared/components/HeaderBar";
import OverviewCard from "../components/OverviewCard";
import ProjectCard from "../components/ProjectCard";
import SectionHeader from "../../../shared/components/SectionHeader";
import FAB from "../components/FAB";

export default function Home() {
  const overviewData = useClientJobStore((state) => state.overviewData);
  const recentJobs = useClientJobStore((state) => state.recentJobs);

  return (
    <div className="min-h-screen flex flex-col bg-background-base">
      <div className="bg-primary pt-4 pb-24">
        <HeaderBar title="Hi, {Placeholder}! 👋" variant="transparent" />
      </div>

      <div className="px-5 -mt-16 flex flex-col gap-8">
        <OverviewCard data={overviewData} />

        {recentJobs.length > 0 && recentJobs.find((job) => job.status === "need_review") ? (
          <div>
            <SectionHeader title="Needs Your Action" />
            <div className="flex flex-col gap-2">
              {recentJobs
                .filter((job) => job.status === "need_review")
                .map((item) => (
                  <ProjectCard key={item.id} project={item} />
                ))}
            </div>
          </div>
        ) : (
          <div className="bg-background-surface rounded-lg p-4 border border-border text-center">
            <p className="text-body-sm text-text-secondary">No pending actions.</p>
          </div>
        )}

        <div>
          <SectionHeader title="Recent Jobs" actionText="View All" onAction={() => console.log("{To Do}")} />
          {recentJobs.length > 0 ? (
            <div className="flex flex-col gap-2">
              {recentJobs.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="bg-background-surface rounded-lg p-4 border border-border text-center">
              <p className="text-body-sm text-text-secondary">No recent jobs.</p>
            </div>
          )}
        </div>
      </div>

      <FAB to="/client/post-project" />

      <BottomNav role="client" />
    </div>
  );
}
