import { useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import { useGetMe } from "../../client/api/user";
import { logout } from "../../auth/api/auth";

import BottomNav from "../../../shared/components/BottomNav";
import HeaderBar from "../../../shared/components/HeaderBar";
import OverviewCard from "../../../shared/components/OverviewCard";
import ProfileMenuItem from "../../../shared/components/ProfileMenuItem";
import Button from "../../../shared/components/Button";

import PenIcon from "../../../assets/icons/pen.svg?react";
import WalletIcon from "../../../assets/icons/wallet.svg?react";
import FileIcon from "../../../assets/icons/file.svg?react";
import ShieldIcon from "../../../assets/icons/shield.svg?react";

function formatBudget(budget?: number | string | null): string {
  if (budget === undefined || budget === null) return "-";
  const num = typeof budget === "string" ? parseFloat(budget) : budget;
  if (isNaN(num) || num === 0) return "-";
  return `Rp${num.toLocaleString("id-ID")}`;
}

function formatRating(rating?: number | string | null): string {
  if (rating === undefined || rating === null) return "-";
  const num = typeof rating === "string" ? parseFloat(rating) : rating;
  if (isNaN(num) || num <= 0) return "-";
  return `⭐ ${num.toFixed(1)}`;
}

export default function Profile() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetMe();

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  const displayName = user?.name || "Freelancer";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const freelancer = user?.freelancerProfile;
  const completedCount = freelancer?.completedCount ?? 0;
  const totalEarning = formatBudget(freelancer?.totalEarning);
  const ratingValue = formatRating(freelancer?.rating);

  const menuItems = [
    {
      icon: <PenIcon className="w-6 h-6 text-text-secondary" />,
      label: "Edit Profile",
      path: "/freelancer/profile/edit",
    },
    {
      icon: <WalletIcon className="w-6 h-6 text-text-secondary" />,
      label: "Wallet",
      path: "/freelancer/wallet",
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
          {isLoading ? (
            <Skeleton circle width={64} height={64} />
          ) : user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={displayName} className="w-16 h-16 rounded-full object-cover bg-white" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-h2 font-semibold text-primary">
              {initials}
            </div>
          )}

          <div className="flex flex-col gap-1">
            {isLoading ? (
              <>
                <Skeleton width={160} height={24} borderRadius={4} />
                <Skeleton width={100} height={16} borderRadius={4} />
              </>
            ) : (
              <>
                <h2 className="text-h2 font-semibold text-white">{displayName}</h2>
                <p className="text-white text-body">Freelancer</p>
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
            { label: "Completed", value: completedCount },
            { label: "Total Earning", value: totalEarning },
            { label: "Rating", value: ratingValue },
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

      <BottomNav role="freelancer" />
    </div>
  );
}
