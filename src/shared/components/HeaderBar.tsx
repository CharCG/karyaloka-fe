import type { ReactNode } from "react";
import { useNavigate } from "react-router";

import ArrowLeft from "../../assets/icons/arrow-left.svg?react";
import IconButton from "./IconButton";

interface HeaderBarProps {
  title?: string;
  showBack?: boolean;
  actionIcon?: ReactNode;
  onActionClick?: () => void;
  variant?: "surface" | "transparent";
}

export default function HeaderBar({
  title,
  showBack = false,
  actionIcon,
  onActionClick,
  variant = "surface",
}: HeaderBarProps) {
  const navigate = useNavigate();

  const variantStyles = {
    surface: "bg-background-surface border-b border-border text-text-primary",
    transparent: "bg-transparent text-background-surface",
  };

  const buttonVariant = variant === "transparent" ? "surface" : "primary";
  const iconColor = variant === "transparent" ? "text-background-surface" : "text-primary";

  return (
    <div className={`w-full py-4 px-5 flex items-center justify-between ${variantStyles[variant]}`}>
      <div className="flex items-center gap-4">
        {showBack ? (
          <>
            <button onClick={() => navigate(-1)} className="cursor-pointer">
              <ArrowLeft className={`w-7 h-7 ${iconColor}`} />
            </button>
            <h3 className="text-h3 font-semibold">{title}</h3>
          </>
        ) : (
          <h2 className="text-h2 font-bold">{title}</h2>
        )}
      </div>

      {actionIcon && <IconButton variant={buttonVariant} icon={actionIcon} onClick={onActionClick} className="" />}
    </div>
  );
}
