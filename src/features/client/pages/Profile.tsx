import { useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import { useGetMe } from "../api/user";
import { useGetClientDashboard } from "../api/projects";
import { logout } from "../../auth/api/auth";

import BottomNav from "../../../shared/components/BottomNav";
import HeaderBar from "../../../shared/components/HeaderBar";
import OverviewCard from "../../../shared/components/OverviewCard";
import ProfileMenuItem from "../../../shared/components/ProfileMenuItem";
import Button from "../../../shared/components/Button";

import PenIcon from "../../../assets/icons/pen.svg?react";
import FileIcon from "../../../assets/icons/file.svg?react";
import ShieldIcon from "../../../assets/icons/shield.svg?react";

export default function Profile() {
  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetClientDashboard();

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  const displayName = user?.name || "Client";
  const roleLabel = user?.role === "FREELANCER" || user?.role === "freelancer" ? "Freelancer" : "Client";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const activeCount = dashboardData?.overview?.activeCount ?? 0;
  const completedCount = dashboardData?.overview?.completedCount ?? 0;

  const isLoading = isUserLoading || isDashboardLoading;

  const menuItems = [
    {
      icon: <PenIcon className="w-6 h-6 text-text-secondary" />,
      label: "Edit Profile",
      path: "/client/profile/edit",
    },
    {
      icon: <FileIcon className="w-6 h-6 text-text-secondary" />,
      label: "Terms of Service",
      path: "/terms",
    },
    {
      icon: <ShieldIcon className="w-6 h-6 text-text-secondary" />,
      label: "Privacy Policy",
      path: "/privacy",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background-base pb-32">
      <div className="bg-primary pt-4 pb-24">
        <HeaderBar title="Profile" variant="transparent" />

        <div className="flex items-center gap-4 px-5 pt-2 pb-2">
          {isUserLoading ? (
            <Skeleton circle width={64} height={64} />
          ) : user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={displayName}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover bg-white"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-h2 font-semibold text-primary">
              {initials}
            </div>
          )}

          <div className="flex flex-col gap-1">
            {isUserLoading ? (
              <>
                <Skeleton width={160} height={24} borderRadius={4} />
                <Skeleton width={100} height={16} borderRadius={4} />
              </>
            ) : (
              <>
                <h2 className="text-h2 font-semibold text-white">{displayName}</h2>
                <p className="text-white text-body">{roleLabel}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 -mt-16 flex flex-col gap-8">
        <OverviewCard
          title="Statistics"
          isLoading={isLoading}
          stats={[
            { label: "Active", value: activeCount },
            { label: "Total Spent", value: "-" },
            { label: "Completed", value: completedCount },
          ]}
        />

        <div className="flex flex-col">
          {menuItems.map((item, index, array) => {
            let roundedClass = "";
            if (index === 0) roundedClass = "rounded-t-lg";
            if (index === array.length - 1) roundedClass = "rounded-b-lg";

            const overlapClass = index > 0 ? "-mt-[1px]" : "";

            return (
              <ProfileMenuItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                className={`${roundedClass} ${overlapClass}`}
                onClick={() => navigate(item.path)}
              />
            );
          })}
        </div>

        <Button variant="danger-outline" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

      <BottomNav role="client" />
    </div>
  );
}
