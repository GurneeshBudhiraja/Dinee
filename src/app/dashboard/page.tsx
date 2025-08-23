"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DashboardLayout,
  CallsSection,
  OrdersSection,
  SettingsSection,
} from "@/components/dashboard";
import { useRestaurantStorage } from "@/hooks/useRestaurantStorage";

export default function DashboardPage() {
  const router = useRouter();
  const { restaurantId, restaurantData, loading } = useRestaurantStorage();
  const restaurantName = restaurantData?.name || "Restaurant Dashboard";

  // Redirect to onboarding if no restaurant ID is found
  useEffect(() => {
    if (!loading && !restaurantId) {
      router.push("/onboarding");
    }
  }, [loading, restaurantId, router]);

  // Show loading state while checking for restaurant ID
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if no restaurant ID
  if (!restaurantId) {
    return null;
  }

  return (
    <DashboardLayout restaurantName={restaurantName}>
      <CallsSection tabId="calls" />
      <OrdersSection tabId="orders" />
      <SettingsSection tabId="settings" />
    </DashboardLayout>
  );
}
