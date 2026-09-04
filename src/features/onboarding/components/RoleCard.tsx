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
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 py-4 px-4 border rounded-lg cursor-pointer transition-all ${
        selected ? "border-2 border-primary" : "border-border bg-background-surface"
      } ${className}`.trim()}
    >
      <img src={image} alt={title} className="w-40" />

      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="text-body-sm text-text-secondary mt-2">{description}</p>
      </div>
    </div>
  );
}
