"use client";

import React, { ReactNode } from "react";
import { CallsProvider } from "./CallsContext";
import { OrdersProvider } from "./OrdersContext";
import { Toaster } from "@/components/ui/sonner";

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Main application provider that wraps all context providers
 * This ensures all state management contexts are available throughout the app
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <CallsProvider>
      <OrdersProvider>
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
  );
}

// Export all hooks for easy access
export { useCalls } from "./CallsContext";
export { useOrders } from "./OrdersContext";
