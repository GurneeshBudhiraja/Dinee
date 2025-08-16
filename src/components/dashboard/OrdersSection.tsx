import React, { useState } from "react";
import { cn } from "@/lib/utils";
import CurrentOrders from "./CurrentOrders";
import PastOrders from "./PastOrders";

export interface OrdersSectionProps {
  tabId: "orders";
}

type OrdersTabType = "current" | "past";

const OrdersSection: React.FC<OrdersSectionProps> = ({ tabId }) => {
  const [activeOrdersTab, setActiveOrdersTab] =
    useState<OrdersTabType>("current");

  const ordersTabs = [
    { id: "current" as OrdersTabType, label: "Current Orders" },
    { id: "past" as OrdersTabType, label: "Past Orders" },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation for Orders */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {ordersTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveOrdersTab(tab.id)}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                activeOrdersTab === tab.id
                  ? "border-primary-500 text-primary-600"
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
        {activeOrdersTab === "current" && <CurrentOrders />}

        {activeOrdersTab === "past" && <PastOrders />}
      </div>
    </div>
  );
};

export default OrdersSection;
