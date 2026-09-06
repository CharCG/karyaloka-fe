import { useParams, useNavigate, useSearchParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import { useGetPublicProfile } from "../api/user";

import HeaderBar from "../../../shared/components/HeaderBar";
import Button from "../../../shared/components/Button";
import StarIcon from "../../../assets/icons/star.svg?react";

function formatRating(rating?: number | string | null): string {
  if (rating === undefined || rating === null) return "-";
  const num = typeof rating === "string" ? parseFloat(rating) : rating;
  if (isNaN(num) || num <= 0) return "-";
  return num.toFixed(1);
}

export default function CandidateProfile() {
  const { freelancerUserId } = useParams<{ freelancerUserId: string }>();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const navigate = useNavigate();

  const { data: user, isLoading } = useGetPublicProfile(freelancerUserId || "");

  const freelancer = user?.freelancerProfile;
  const displayName = user?.name || "Freelancer";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const activeProjects = freelancer?._count?.assignedProjects ?? 0;
  const completedProjects = freelancer?.completedCount ?? 0;
  const ratingValue = formatRating(freelancer?.rating);
  const primaryRole = freelancer?.skills?.[0] ? `Freelancer • ${freelancer.skills[0]}` : "Freelancer";

  const handleHire = () => {
    if (!projectId || !freelancer?.id) return;
    navigate(`/client/projects/${projectId}/checkout/${freelancer.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-base pb-12">
      <div className="bg-primary pt-4 pb-20">
        <HeaderBar title="Freelancer Profile" showBack variant="transparent" />

        <div className="flex items-center gap-4 px-5 pt-2 pb-2">
          {isLoading ? (
            <Skeleton circle width={80} height={80} />
          ) : user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={displayName}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover bg-white shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-h1 font-semibold text-primary shrink-0">
              {initials}
            </div>
          )}

          <div className="flex flex-col gap-1 min-w-0">
            {isLoading ? (
              <>
                <Skeleton width={160} height={24} borderRadius={4} />
                <Skeleton width={120} height={16} borderRadius={4} />
              </>
            ) : (
              <>
                <h2 className="text-h2 font-semibold text-white truncate">{displayName}</h2>
                <p className="text-white/90 text-body-sm truncate">{primaryRole}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 flex flex-col gap-6">
        <div className="bg-background-surface rounded-lg p-5 border border-border flex items-center justify-around">
          <div className="flex flex-col items-center flex-1">
            <span className="text-caption text-text-secondary">Active</span>
            <span className="text-body-lg font-semibold text-text-primary mt-1">
              {isLoading ? <Skeleton width={24} height={20} /> : activeProjects}
            </span>
          </div>

          <div className="w-[1px] h-8 bg-border" />

          <div className="flex flex-col items-center flex-1">
            <span className="text-caption text-text-secondary">Completed</span>
            <span className="text-body-lg font-semibold text-text-primary mt-1">
              {isLoading ? <Skeleton width={24} height={20} /> : completedProjects}
            </span>
          </div>

          <div className="w-[1px] h-8 bg-border" />

          <div className="flex flex-col items-center flex-1">
            <span className="text-caption text-text-secondary">Rating</span>
            <div className="flex items-center gap-1 mt-1">
              <StarIcon className="w-4 h-4 text-warning fill-warning" />
              <span className="text-body-lg font-semibold text-text-primary">
                {isLoading ? <Skeleton width={28} height={20} /> : ratingValue}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-body font-semibold text-text-primary">Description</h3>
          <p className="text-body-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {freelancer?.description || "No description provided."}
          </p>
        </div>

        {freelancer?.skills && freelancer.skills.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-body font-semibold text-text-primary">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-body-sm px-4 py-2 rounded-full bg-background-surface border border-border text-text-secondary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h3 className="text-body font-semibold text-text-primary">Portofolio</h3>
          {freelancer?.portfolioItems && freelancer.portfolioItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {freelancer.portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-background-surface rounded-lg border border-border overflow-hidden flex flex-col gap-2 p-3"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.description || "Portfolio thumbnail"}
                      className="w-full h-28 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-28 bg-background-base rounded-lg flex items-center justify-center text-text-tertiary text-caption">
                      No Image
                    </div>
                  )}
                  <h4 className="text-body-sm font-semibold text-text-primary line-clamp-2">{item.description || item.title}</h4>
                  {(item.externalUrl || item.projectUrl) && (
                    <a
                      href={item.externalUrl || item.projectUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-caption font-semibold text-primary truncate"
                    >
                      View Project ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-background-surface rounded-lg p-6 border border-border text-center">
              <p className="text-body-sm text-text-secondary">No portfolio items added yet.</p>
            </div>
          )}
        </div>

        {projectId && (
          <div className="pt-2">
            <Button onClick={handleHire}>
              Hire
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
