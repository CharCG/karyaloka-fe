import SearchIcon from "../../../assets/icons/magnifying-glass.svg?react";

interface ProjectsHeaderProps {
  onSearchClick?: () => void;
  isSearchOpen?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onClearSearch?: () => void;
}

export default function ProjectsHeader({
  onSearchClick,
  isSearchOpen = false,
  searchQuery = "",
  onSearchChange,
  onClearSearch,
}: ProjectsHeaderProps) {
  return (
    <div className="w-full bg-background-surface pt-12 pb-3 px-5 border-b border-border/40">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="text-h2 font-bold text-text-primary">Projects</h1>

        {/* Right: Search Icon */}
        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Search projects"
          className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-info-bg transition-colors cursor-pointer"
        >
          <SearchIcon className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Expandable Search Input Bar */}
      {isSearchOpen && (
        <div className="mt-3 relative transition-all duration-200">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <SearchIcon className="w-4 h-4 text-text-tertiary" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search by job title or client..."
            className="w-full pl-10 pr-9 py-2 bg-background-base border border-border rounded-xl text-body-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-tertiary hover:text-text-primary cursor-pointer text-caption"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}
