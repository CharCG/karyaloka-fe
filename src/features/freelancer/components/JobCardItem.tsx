export interface JobPost {
  id: string;
  clientName: string;
  clientAvatar?: string;
  title: string;
  employmentType: string; // e.g. "Full-time • Remote" or "Contract • Hybrid"
  budgetRange: string; // e.g. "$1,500–$2,000" or "Rp 15.000.000 - Rp 25.000.000"
  description: string;
  skills: string[];
  postedTimeAgo: string; // e.g. "Posted 2h ago"
  applicantsAvatars?: string[];
  applicantCount?: number;
}

interface JobCardItemProps {
  job: JobPost;
  className?: string;
  style?: React.CSSProperties;
  cardBgColor?: string; // allow background variation for stack
}

export default function JobCardItem({
  job,
  className = "",
  style,
  cardBgColor = "bg-[#1B2A4A]",
}: JobCardItemProps) {
  const visibleSkills = job.skills.slice(0, 3);
  const remainingSkillsCount = job.skills.length - visibleSkills.length;

  return (
    <div
      style={style}
      className={`w-full h-[470px] ${cardBgColor} text-white rounded-[32px] p-6 shadow-2xl flex flex-col justify-between select-none relative overflow-hidden ${className}`}
    >
      {/* Top Section: Client Info */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden shrink-0 border border-white/20 flex items-center justify-center font-bold text-white text-body-sm">
            {job.clientAvatar ? (
              <img
                src={job.clientAvatar}
                alt={job.clientName}
                className="w-full h-full object-cover"
              />
            ) : (
              job.clientName.charAt(0)
            )}
          </div>
          <span className="text-body-sm font-semibold text-white/90">
            {job.clientName}
          </span>
        </div>

        {/* Job Title */}
        <h2 className="text-h3 font-bold text-white leading-tight mb-2">
          {job.title}
        </h2>

        {/* Job Metadata: Type & Location */}
        <p className="text-body-sm text-white/70 font-medium mb-2">
          {job.employmentType}
        </p>

        {/* Budget */}
        <p className="text-h3 font-bold text-white mb-3">
          {job.budgetRange}
        </p>

        {/* Description */}
        <p className="text-body-sm text-white/80 line-clamp-3 leading-relaxed mb-4">
          {job.description}
        </p>
      </div>

      {/* Bottom Section: Skills & Footer */}
      <div>
        {/* Skill Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-caption font-medium border border-white/10"
            >
              {skill}
            </span>
          ))}
          {remainingSkillsCount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-caption font-medium border border-white/10">
              +{remainingSkillsCount}
            </span>
          )}
        </div>

        {/* Footer: Applicant Avatars & Timestamp */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center -space-x-2">
            {job.applicantsAvatars && job.applicantsAvatars.length > 0 ? (
              job.applicantsAvatars.slice(0, 3).map((avatar, idx) => (
                <div
                  key={idx}
                  className="w-7 h-7 rounded-full border-2 border-[#1B2A4A] bg-gray-300 overflow-hidden"
                >
                  <img
                    src={avatar}
                    alt="Applicant"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="flex -space-x-1.5">
                <div className="w-7 h-7 rounded-full border-2 border-[#1B2A4A] bg-amber-400 flex items-center justify-center text-[10px] font-bold text-black">
                  JD
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-[#1B2A4A] bg-emerald-400 flex items-center justify-center text-[10px] font-bold text-black">
                  AN
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-[#1B2A4A] bg-purple-400 flex items-center justify-center text-[10px] font-bold text-white">
                  +3
                </div>
              </div>
            )}
          </div>

          <span className="text-caption text-white/60 font-medium">
            {job.postedTimeAgo}
          </span>
        </div>
      </div>
    </div>
  );
}
