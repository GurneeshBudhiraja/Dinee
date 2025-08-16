"use client";

import React from "react";
import {
  DashboardLayout,
  CallsSection,
  OrdersSection,
  SettingsSection,
} from "@/components/dashboard";
import { useRestaurant } from "@/contexts";

export default function DashboardPage() {
  const {
    state: { currentRestaurant },
  } = useRestaurant();
  const restaurantName = currentRestaurant?.name || "Restaurant Dashboard";

  return (
    <DashboardLayout restaurantName={restaurantName}>
      <CallsSection tabId="calls" />
      <OrdersSection tabId="orders" />
      <SettingsSection tabId="settings" />
    </DashboardLayout>
  );
}
