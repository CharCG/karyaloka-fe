interface DiscoverHeaderProps {
  onFilterClick?: () => void;
}

export default function DiscoverHeader({ onFilterClick }: DiscoverHeaderProps) {
  return (
    <div className="w-full bg-background-surface pt-12 pb-3 px-5 border-b border-border/40">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="text-h2 font-bold text-text-primary">Discover</h1>

        {/* Right: Filter (Sliders) Icon */}
        <button
          type="button"
          onClick={onFilterClick}
          aria-label="Filter"
          className="w-10 h-10 rounded-full flex items-center justify-center text-text-primary hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 13.5V3.75m0 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm0 0V20.25m12-9V3.75m0 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm0 0V20.25m-6-13.5V3.75m0 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm0 0V20.25"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
