import type { KeyboardEvent } from "react";

export interface RoleCardProps {
  title: string;
  description: string;
  image: string;
  selected: boolean;
  onClick?: () => void;
  className?: string;
}

export default function RoleCard({
  title,
  description,
  image,
  selected,
  onClick,
  className = "",
}: RoleCardProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`flex items-center gap-4 py-4 px-4 border rounded-lg cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
        selected ? "border-2 border-primary" : "border-border bg-background-surface"
      } ${className}`.trim()}
    >
      <img src={image} alt={title} width={160} height={160} className="w-40 h-auto object-contain" />

      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="text-body-sm text-text-secondary mt-2">{description}</p>
      </div>
    </div>
  );
}
