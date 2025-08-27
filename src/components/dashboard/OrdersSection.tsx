import React, { useState } from "react";
import { cn } from "@/lib/utils";
import CurrentOrders from "./CurrentOrders";
import PastOrders from "./PastOrders";
import { ShoppingBag, History, Clock } from "lucide-react";
import { useOrders } from "@/contexts";

export interface OrdersSectionProps {
  tabId: "orders";
}

type OrdersTabType = "current" | "past";

const OrdersSection: React.FC<OrdersSectionProps> = ({ tabId }) => {
  const [activeOrdersTab, setActiveOrdersTab] =
    useState<OrdersTabType>("current");

  const {
    state: { activeOrders, pastOrders },
  } = useOrders();

  const ordersTabs = [
    {
      id: "current" as OrdersTabType,
      label: "Current Orders",
      icon: Clock,
      count: activeOrders.length,
    },
    {
      id: "past" as OrdersTabType,
      label: "Order History",
      icon: History,
      count: pastOrders.length,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">
              Manage and track your restaurant orders
            </p>
          </div>
        </div>
      </div>

      {/* Sub-navigation for Orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <nav className="flex">
          {ordersTabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveOrdersTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-3 py-4 px-6 font-medium text-sm transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  index === 0 ? "rounded-l-xl" : "",
                  index === ordersTabs.length - 1 ? "rounded-r-xl" : "",
                  activeOrdersTab === tab.id
                    ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b-2 border-transparent"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <div
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    activeOrdersTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {tab.count}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeOrdersTab === "current" && <CurrentOrders />}
        {activeOrdersTab === "past" && <PastOrders />}
      </div>
    </div>
  );
};

export default OrdersSection;
