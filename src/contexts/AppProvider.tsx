"use client";

import React, { ReactNode } from "react";
import { CallsProvider } from "./CallsContext";
import { OrdersProvider } from "./OrdersContext";
import { RestaurantProvider } from "./RestaurantContext";
import { Toaster } from "@/components/ui/sonner";
import { useRestaurantStorage } from "@/hooks/useRestaurantStorage";

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Main application provider that wraps all context providers
 * This ensures all state management contexts are available throughout the app
 */
export function AppProvider({ children }: AppProviderProps) {
  const { restaurantId } = useRestaurantStorage();

  return (
    <RestaurantProvider>
      <CallsProvider key={`calls-${restaurantId || "no-id"}`}>
        <OrdersProvider key={`orders-${restaurantId || "no-id"}`}>
          {children}
          <Toaster
            closeButton={true}
            richColors={true}
            duration={2000}
            theme="system"
            position="bottom-right"
          />
        </OrdersProvider>
      </CallsProvider>
    </RestaurantProvider>
  );
}

// Export all hooks for easy access
export { useCalls } from "./CallsContext";
export { useOrders } from "./OrdersContext";
export { useRestaurant } from "./RestaurantContext";
