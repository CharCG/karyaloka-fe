import type { ReactNode } from "react";
import { useNavigate } from "react-router";

import ArrowLeft from "../../assets/icons/arrow-left.svg?react";

export interface HeaderBarProps {
  title?: string;
  showBack?: boolean;
  actionIcon?: ReactNode;
  onActionClick?: () => void;
  variant?: "surface" | "transparent";
  className?: string;
}

export default function HeaderBar({
  title,
  showBack = false,
  actionIcon,
  onActionClick,
  variant = "surface",
  className = "",
}: HeaderBarProps) {
  const navigate = useNavigate();

  const variantStyles = {
    surface: "bg-background-surface border-b border-border text-text-primary",
    transparent: "bg-transparent text-background-surface",
  };

  const iconColor = variant === "transparent" ? "text-background-surface" : "text-primary";

  return (
    <div className={`w-full py-5 px-5 flex items-center justify-between ${variantStyles[variant]} ${className}`.trim()}>
      <div className="flex items-center gap-4">
        {showBack ? (
          <>
            <button type="button" onClick={() => navigate(-1)} className="cursor-pointer">
              <ArrowLeft className={`w-7 h-7 ${iconColor}`} />
            </button>
            <h3 className="text-h3 font-semibold">{title}</h3>
          </>
        ) : (
          <h2 className="text-h2 font-semibold">{title}</h2>
        )}
      </div>

      {actionIcon && (
        <button
          type="button"
          onClick={onActionClick}
          className={`flex items-center justify-center cursor-pointer ${
            variant === "transparent" ? "text-white" : "text-text-primary"
          }`}
        >
          {actionIcon}
        </button>
      )}
    </div>
  );
}
