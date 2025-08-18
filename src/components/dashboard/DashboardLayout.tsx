import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface DashboardLayoutProps {
  restaurantName: string;
  children: React.ReactNode;
}

export type TabType = "calls" | "orders" | "settings";

export interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  restaurantName,
  children,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("calls");
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  const tabs: TabConfig[] = [
    {
      id: "calls",
      label: "Calls",
      icon: (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "Orders",
      icon: (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const handleKeyDown = (event: React.KeyboardEvent, tabId: TabType) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === tabId);
    let nextIndex = currentIndex;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case "ArrowRight":
        event.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case "Home":
        event.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        event.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    tabRefs.current[nextTab.id]?.focus();
  };

  const handleSkipToContent = (event: React.MouseEvent) => {
    event.preventDefault();
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to content link for accessibility */}
      <a
        ref={skipLinkRef}
        href="#main-content"
        className="skip-link"
        onClick={handleSkipToContent}
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                {restaurantName}
              </h1>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Call Management Dashboard
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav
        className="bg-white border-b border-gray-200"
        role="tablist"
        aria-label="Dashboard navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mobile-nav space-x-6 sm:space-x-8">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                className={cn(
                  "flex items-center space-x-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white",
                  "min-h-44 min-w-44", // Ensure minimum touch target size
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                id={`${tab.id}-tab`}
                tabIndex={activeTab === tab.id ? 0 : -1}
              >
                <span
                  className={cn(
                    "transition-colors duration-200 flex-shrink-0",
                    activeTab === tab.id ? "text-blue-600" : "text-gray-400"
                  )}
                >
                  {tab.icon}
                </span>
                <span className="text-xs sm:text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
        tabIndex={-1}
      >
        <div
          id={`${activeTab}-panel`}
          role="tabpanel"
          aria-labelledby={`${activeTab}-tab`}
          className="focus:outline-none animate-fade-in"
        >
          {React.Children.map(children, (child) => {
            if (
              React.isValidElement(child) &&
              (child.props as any).tabId === activeTab
            ) {
              return child;
            }
            return null;
          })}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
