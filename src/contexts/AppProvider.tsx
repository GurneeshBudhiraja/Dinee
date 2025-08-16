"use client";

import React, { ReactNode } from "react";
import { RestaurantProvider } from "./RestaurantContext";
import { CallsProvider } from "./CallsContext";
import { OrdersProvider } from "./OrdersContext";

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Main application provider that wraps all context providers
 * This ensures all state management contexts are available throughout the app
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <RestaurantProvider>
      <CallsProvider>
        <OrdersProvider>{children}</OrdersProvider>
      </CallsProvider>
    </RestaurantProvider>
  );
}

// Export all hooks for easy access
export { useRestaurant } from "./RestaurantContext";
export { useCalls } from "./CallsContext";
export { useOrders } from "./OrdersContext";
