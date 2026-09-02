import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
  rightElement?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  actionText,
  onAction,
  actionHref,
  rightElement,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-3 ${className}`}>
      <h2 className="text-body-lg font-bold text-text-primary">{title}</h2>

      {rightElement ? (
        rightElement
      ) : actionText ? (
        actionHref ? (
          <a
            href={actionHref}
            className="text-body-sm font-semibold text-primary hover:underline"
          >
            {actionText}
          </a>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="text-body-sm font-semibold text-primary hover:opacity-80 cursor-pointer"
          >
            {actionText}
          </button>
        )
      ) : null}
    </div>
  );
}
