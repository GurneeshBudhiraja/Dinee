"use client";

import React from "react";
import {
  DashboardLayout,
  CallsSection,
  OrdersSection,
  SettingsSection,
} from "@/components/dashboard";
import { useRestaurantStorage } from "@/hooks/useRestaurantStorage";

export default function DashboardPage() {
  const { restaurantData } = useRestaurantStorage();
  const restaurantName = restaurantData?.name || "Restaurant Dashboard";

  return (
    <DashboardLayout restaurantName={restaurantName}>
      <CallsSection tabId="calls" />
      <OrdersSection tabId="orders" />
      <SettingsSection tabId="settings" />
    </DashboardLayout>
  );
}
