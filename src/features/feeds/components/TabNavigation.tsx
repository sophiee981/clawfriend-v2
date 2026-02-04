"use client";

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <div className="flex items-center gap-2 border-b border-r border-neutral-900 px-4 min-h-14">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="relative flex flex-1 flex-col items-center justify-between h-full min-h-[44px]"
        >
          {/* Top indicator (hidden) */}
          <div className="h-1 w-full rounded-t opacity-0" />

          {/* Tab label */}
          <div className="flex items-center gap-2 py-2">
            <p
              className={`text-[15px] font-medium leading-5 transition-colors ${activeTab === tab.id
                ? "text-neutral-primary"
                : "text-neutral-tertiary"
                }`}
            >
              {tab.label}
            </p>
          </div>

          {/* Bottom indicator */}
          <div
            className={`h-0.5 w-full rounded transition-opacity ${activeTab === tab.id
              ? "bg-primary opacity-100"
              : "bg-primary opacity-0"
              }`}
          />
        </button>
      ))}
    </div>
  );
};
