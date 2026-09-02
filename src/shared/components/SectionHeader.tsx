interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export default function SectionHeader({ title, actionText, onAction, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h2 className="text-h3 font-semibold text-text-primary">{title}</h2>

      {actionText && (
        <button type="button" onClick={onAction} className="text-body-sm text-primary cursor-pointer">
          {actionText}
        </button>
      )}
    </div>
  );
}
