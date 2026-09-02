export interface TabItem<T extends string = string> {
  key: T;
  label: string;
  count?: number;
}

interface TabSwitcherProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (key: T) => void;
  className?: string;
}

export default function TabSwitcher<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabSwitcherProps<T>) {
  return (
    <div
      className={`w-full bg-background-surface border-b border-border px-5 flex items-center justify-start gap-6 overflow-x-auto no-scrollbar ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`relative py-3.5 text-body-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 ${
              isActive
                ? "text-primary font-bold"
                : "text-text-tertiary font-normal hover:text-text-secondary"
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold transition-colors ${
                  isActive
                    ? "bg-info-bg text-primary"
                    : "bg-gray-100 text-text-tertiary"
                }`}
              >
                {tab.count}
              </span>
            )}

            {/* Active Blue Underline */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full transition-all duration-200" />
            )}
          </button>
        );
      })}
    </div>
  );
}
