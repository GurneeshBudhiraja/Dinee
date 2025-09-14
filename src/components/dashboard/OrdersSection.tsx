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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-base font-semibold text-white">Orders</h2>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          <span className="text-sm font-medium text-emerald-400">
            {activeOrders.length} Active
          </span>
        </div>
      </div>

      {/* Sub-navigation for Orders */}
      <div className="inline-flex bg-black border border-white/10 rounded-lg p-0.5">
        <nav className="flex">
          {ordersTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveOrdersTab(tab.id)}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black",
                  "cursor-pointer rounded-md",
                  activeOrdersTab === tab.id
                    ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center space-x-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <div
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      activeOrdersTab === tab.id
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-white/10 text-white/60"
                    )}
                  >
                    {tab.count}
                  </div>
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
