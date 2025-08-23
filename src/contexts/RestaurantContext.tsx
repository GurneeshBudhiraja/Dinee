"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRestaurantStorage } from "@/hooks/useRestaurantStorage";
import { Doc } from "../../convex/_generated/dataModel";

interface RestaurantContextType {
  restaurant: Doc<"restaurants"> | null | undefined;
  isLoading: boolean;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
  const { restaurantId, loading: storageLoading } = useRestaurantStorage();

  const restaurantData = useQuery(
    api.restaurants.getRestaurantByRestaurantId,
    restaurantId ? { restaurantId } : "skip"
  );

  const isLoading = storageLoading || restaurantData === undefined;

  return (
    <RestaurantContext.Provider
      value={{ restaurant: restaurantData, isLoading }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
};
