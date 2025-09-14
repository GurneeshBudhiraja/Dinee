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
    { id: "current" as CallsTabType, label: "Live Calls" },
    { id: "past" as CallsTabType, label: "Call History" },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation for Calls */}
      <div className="inline-flex bg-gray-900/30 border border-gray-800 rounded-md p-0.5">
        <nav className="flex">
          {callsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCallsTab(tab.id)}
              className={cn(
                "relative px-3 py-1.5 text-sm font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black",
                "cursor-pointer rounded-sm",
                activeCallsTab === tab.id
                  ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/30"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeCallsTab === "current" && <CurrentCalls />}
        {activeCallsTab === "past" && <PastCalls />}
      </div>
    </div>
  );
};

export default CallsSection;
