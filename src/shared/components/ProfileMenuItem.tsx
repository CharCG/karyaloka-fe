import type { ReactNode } from "react";
import ChevronRightIcon from "../../assets/icons/chevlon-right.svg?react";

export interface ProfileMenuItemProps {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

export default function ProfileMenuItem({ icon, label, onClick, className = "" }: ProfileMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full bg-background-surface p-4 border border-border flex items-center justify-between cursor-pointer ${className}`.trim()}
    >
      <div className="flex items-center gap-4">
        {icon}
        <span className="text-body text-text-primary">{label}</span>
      </div>
      <ChevronRightIcon className="w-4 h-4 text-text-secondary" />
    </button>
  );
}
