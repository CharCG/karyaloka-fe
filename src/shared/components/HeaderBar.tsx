import type { ReactNode } from "react";
import { useNavigate } from "react-router";

import ArrowLeft from "../../assets/icons/arrow-left.svg?react";

export interface HeaderBarProps {
  title?: string;
  showBack?: boolean;
  backAriaLabel?: string;
  actionIcon?: ReactNode;
  actionAriaLabel?: string;
  onActionClick?: () => void;
  variant?: "surface" | "transparent";
  className?: string;
}

export default function HeaderBar({
  title,
  showBack = false,
  backAriaLabel = "Go back",
  actionIcon,
  actionAriaLabel,
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
    <header className={`w-full py-5 px-5 flex items-center justify-between ${variantStyles[variant]} ${className}`.trim()}>
      <div className="flex items-center gap-4">
        {showBack ? (
          <>
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label={backAriaLabel}
              className="cursor-pointer flex items-center justify-center"
            >
              <ArrowLeft className={`w-7 h-7 ${iconColor}`} />
            </button>
            <h1 className="text-h3 font-semibold">{title}</h1>
          </>
        ) : (
          <h1 className="text-h2 font-semibold">{title}</h1>
        )}
      </div>

      {actionIcon && (
        <button
          type="button"
          onClick={onActionClick}
          aria-label={actionAriaLabel || (typeof title === "string" ? `${title} action` : "Action")}
          className={`flex items-center justify-center cursor-pointer ${
            variant === "transparent" ? "text-white" : "text-text-primary"
          }`}
        >
          {actionIcon}
        </button>
      )}
    </header>
  );
}
