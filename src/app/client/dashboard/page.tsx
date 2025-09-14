"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  DashboardLayout,
  CallsSection,
  OrdersSection,
} from "@/components/dashboard";
import { useRestaurantStorage } from "@/hooks/useRestaurantStorage";
import { toTitleCase } from "@/lib/utils";

/**
 * Main dashboard page that displays restaurant call and order management interface
 * Redirects to onboarding if no restaurant is set up
 */
export default function DashboardPage() {
  const router = useRouter();
  const { restaurantId, restaurantData, loading } = useRestaurantStorage();

  const restaurantName = restaurantData?.name
    ? toTitleCase(restaurantData.name)
    : "Restaurant Dashboard";

  // Redirect to onboarding if no restaurant ID is found
  useEffect(() => {
    if (!loading && !restaurantId) {
      router.push("/client/onboarding");
    }
  }, [loading, restaurantId, router]);

  // Programmatic refresh when coming from onboarding
  useEffect(() => {
    if (restaurantId && !loading) {
      // Check if we're coming from onboarding by checking sessionStorage
      const fromOnboarding = sessionStorage.getItem("fromOnboarding");
      if (fromOnboarding === "true") {
        // Clear the flag
        sessionStorage.removeItem("fromOnboarding");
        // Refresh the page to ensure all data is loaded
        window.location.reload();
      }
    }
  }, [restaurantId, loading]);

  // Show loading state while checking for restaurant ID
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-screen px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center space-y-6"
          >
            <div className="bg-black border border-gray-800 rounded-lg p-8 max-w-md">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-700 border-t-emerald-500 mx-auto"></div>
              </div>
              <h2 className="text-lg font-medium text-white mb-2">
                Loading Dashboard
              </h2>
              <p className="text-gray-400 text-sm">
                Preparing your restaurant management interface...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Don't render dashboard if no restaurant ID
  if (!restaurantId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardLayout restaurantName={restaurantName}>
        <CallsSection tabId="calls" />
        <OrdersSection tabId="orders" />
      </DashboardLayout>
    </div>
  );
}
