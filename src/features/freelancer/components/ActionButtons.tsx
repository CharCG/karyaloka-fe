interface ActionButtonsProps {
  onPass: () => void;
  onInfo: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export default function ActionButtons({
  onPass,
  onInfo,
  onLike,
  disabled = false,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-6 py-2">
      {/* 1. Pass / Reject Button (Red X) */}
      <button
        type="button"
        onClick={onPass}
        disabled={disabled}
        aria-label="Pass project"
        className="w-14 h-14 bg-background-surface rounded-full flex items-center justify-center shadow-lg border border-border/80 text-rose-500 hover:bg-rose-50 active:scale-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.8}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 2. Info / Details Button (Neutral i) */}
      <button
        type="button"
        onClick={onInfo}
        disabled={disabled}
        aria-label="View project details"
        className="w-11 h-11 bg-background-surface rounded-full flex items-center justify-center shadow-md border border-border/80 text-text-secondary hover:bg-gray-100 active:scale-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      </button>

      {/* 3. Like / Interested Button (Green Heart) */}
      <button
        type="button"
        onClick={onLike}
        disabled={disabled}
        aria-label="Like / Apply project"
        className="w-14 h-14 bg-background-surface rounded-full flex items-center justify-center shadow-lg border border-border/80 text-emerald-500 hover:bg-emerald-50 active:scale-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg
          className="w-7 h-7 fill-emerald-500 text-emerald-500"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
    </div>
  );
}
