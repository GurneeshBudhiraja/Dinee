import React, { useState } from "react";
import { cn } from "@/lib/utils";
import CurrentCalls from "./CurrentCalls";
import PastCalls from "./PastCalls";

export interface CallsSectionProps {
  tabId: "calls";
}

type CallsTabType = "current" | "past";

const CallsSection: React.FC<CallsSectionProps> = () => {
  const [activeCallsTab, setActiveCallsTab] = useState<CallsTabType>("current");

  const callsTabs = [
    { id: "current" as CallsTabType, label: "Current Calls" },
    { id: "past" as CallsTabType, label: "Past Calls" },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation for Calls */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {callsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCallsTab(tab.id)}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                activeCallsTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeCallsTab === "current" && <CurrentCalls />}

        {activeCallsTab === "past" && <PastCalls />}
      </div>
    </div>
  );
};

export default CallsSection;
