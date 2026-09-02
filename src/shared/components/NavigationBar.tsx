import { useLocation, useNavigate } from "react-router";

import HomeIcon from "../../assets/icons/house.svg?react";
import HomeSolidIcon from "../../assets/icons/house-solid.svg?react";
import FolderIcon from "../../assets/icons/folder.svg?react";
import FolderSolidIcon from "../../assets/icons/folder-solid.svg?react";
import ChatIcon from "../../assets/icons/chat.svg?react";
import ChatSolidIcon from "../../assets/icons/chat-solid.svg?react";
import UserIcon from "../../assets/icons/user.svg?react";
import UserSolidIcon from "../../assets/icons/user-solid.svg?react";
import SearchIcon from "../../assets/icons/magnifying-glass.svg?react";

interface BottomNavProps {
  role: "client" | "freelancer";
}

export default function BottomNav({ role }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const clientNavItems = [
    { label: "Home", path: "/client", icon: HomeIcon, activeIcon: HomeSolidIcon },
    { label: "Projects", path: "/client/projects", icon: FolderIcon, activeIcon: FolderSolidIcon },
    { label: "Messages", path: "/client/messages", icon: ChatIcon, activeIcon: ChatSolidIcon },
    { label: "Profile", path: "/client/profile", icon: UserIcon, activeIcon: UserSolidIcon },
  ];

  const freelancerNavItems = [
    { label: "Discover", path: "/freelancer", icon: SearchIcon, activeIcon: SearchIcon },
    { label: "Projects", path: "/freelancer/projects", icon: FolderIcon, activeIcon: FolderSolidIcon },
    { label: "Messages", path: "/freelancer/messages", icon: ChatIcon, activeIcon: ChatSolidIcon },
    { label: "Profile", path: "/freelancer/profile", icon: UserIcon, activeIcon: UserSolidIcon },
  ];

  const navItems = role === "client" ? clientNavItems : freelancerNavItems;

  return (
    <div className="fixed bottom-8 left-5 right-5 bg-background-surface/70 backdrop-blur-lg border border-border py-4 px-4 rounded-3xl">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/client" &&
              item.path !== "/freelancer" &&
              location.pathname.startsWith(`${item.path}/`));
          const IconComponent = isActive ? item.activeIcon : item.icon;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 cursor-pointer transition-colors"
            >
              <IconComponent className={`w-6 h-6 ${isActive ? "text-primary" : "text-text-tertiary"}`} />
              <span className={`text-caption ${isActive ? "text-primary font-semibold" : "text-text-tertiary"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
