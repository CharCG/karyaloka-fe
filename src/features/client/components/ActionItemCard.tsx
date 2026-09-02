import type { ReactNode } from "react";

export interface ActionItem {
  id: string;
  title: string;
  projectName: string;
  timeAgo: string;
  actionText?: string;
  iconType?: "deliverable" | "application" | "message" | "custom";
  icon?: ReactNode;
  onAction?: () => void;
}

interface ActionItemCardProps {
  item: ActionItem;
}

export default function ActionItemCard({ item }: ActionItemCardProps) {
  return (
    <div className="bg-background-surface rounded-2xl p-4 border border-border flex items-center justify-between gap-3 transition-all hover:border-primary/40">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Icon Container */}
        <div className="w-11 h-11 rounded-xl bg-info-bg flex items-center justify-center shrink-0">
          {item.icon || (
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col min-w-0">
          <h3 className="text-body-sm font-bold text-text-primary truncate">
            {item.title}
          </h3>
          <p className="text-body-sm text-text-secondary truncate font-medium">
            {item.projectName}
          </p>
          <span className="text-caption text-text-tertiary mt-0.5">
            {item.timeAgo}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={item.onAction}
        className="shrink-0 px-4 py-2 rounded-xl bg-info-bg text-primary text-caption font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer active:scale-95"
      >
        {item.actionText || "Review"}
      </button>
    </div>
  );
}
