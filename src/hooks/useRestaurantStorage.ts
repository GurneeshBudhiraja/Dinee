"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Restaurant } from "@/types/global";

const RESTAURANT_ID_KEY = "restaurantId";

/**
 * Custom hook to manage restaurant ID in local storage and fetch data from Convex.
 * @returns An object with functions to interact with the restaurant data.
 */
export function useRestaurantStorage() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Convex queries and mutations
  const restaurantData = useQuery(
    api.restaurants.getRestaurant,
    restaurantId ? { restaurantId } : "skip"
  );
  const menuItems = useQuery(
    api.menuItems.getMenuItems,
    restaurantId ? { restaurantId } : "skip"
  );
  const createRestaurant = useMutation(api.restaurants.createRestaurant);
  const updateRestaurant = useMutation(api.restaurants.updateRestaurant);
  const createMenuItems = useMutation(api.menuItems.createMenuItems);
  const deleteRestaurantData = useMutation(api.restaurants.deleteRestaurantData);

  const getRestaurantId = useCallback(() => {
    try {
      const storedId = localStorage.getItem(RESTAURANT_ID_KEY);
      if (storedId) {
        setRestaurantId(storedId);
        return storedId;
      }
      return null;
    } catch (error) {
      console.error("Failed to get restaurant ID from storage", error);
      return null;
    }
  }, []);

  const saveRestaurantId = useCallback((id: string) => {
    try {
      localStorage.setItem(RESTAURANT_ID_KEY, id);
      setRestaurantId(id);
    } catch (error) {
      console.error("Failed to save restaurant ID to storage", error);
    }
  }, []);

  const clearRestaurantId = useCallback(() => {
    try {
      localStorage.removeItem(RESTAURANT_ID_KEY);
      setRestaurantId(null);
    } catch (error) {
      console.error("Failed to clear restaurant ID from storage", error);
    }
  }, []);

  const saveRestaurantData = useCallback(async (data: Omit<Restaurant, 'id'>) => {
    try {
      if (restaurantId) {
        // Update existing restaurant
        await updateRestaurant({
          restaurantId,
          name: data.name,
          agentName: data.agentName,
          specialInstructions: data.specialInstructions,
          languagePreference: data.languagePreference as 'english' | 'spanish' | 'french',
        });

        // Save menu items separately
        if (data.menuDetails && data.menuDetails.length > 0) {
          await createMenuItems({
            restaurantId,
            menuItems: data.menuDetails,
          });
        }

        return { restaurantId };
      } else {
        // Create new restaurant
        const result = await createRestaurant({
          name: data.name,
          agentName: data.agentName,
          specialInstructions: data.specialInstructions,
          languagePreference: data.languagePreference as 'english' | 'spanish' | 'french',
        });

        if (result?.restaurantId) {
          saveRestaurantId(result.restaurantId);

          // Save menu items separately
          if (data.menuDetails && data.menuDetails.length > 0) {
            await createMenuItems({
              restaurantId: result.restaurantId,
              menuItems: data.menuDetails,
            });
          }

          return result;
        }
        throw new Error("Failed to create restaurant");
      }
    } catch (error) {
      console.error("Failed to save restaurant data", error);
      throw error;
    }
  }, [restaurantId, createRestaurant, updateRestaurant, createMenuItems, saveRestaurantId]);

  const deleteAllData = useCallback(async () => {
    try {
      if (restaurantId) {
        const success = await deleteRestaurantData({ restaurantId });
        if (success) {
          clearRestaurantId();
        }
        return success;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete restaurant data", error);
      throw error;
    }
  }, [restaurantId, deleteRestaurantData, clearRestaurantId]);

  useEffect(() => {
    const id = getRestaurantId();
    // If we have a restaurant ID, we're not loading anymore
    if (id) {
      setLoading(false);
    } else {
      // If no restaurant ID, we're still loading until we confirm there isn't one
      setLoading(false);
    }
  }, [getRestaurantId]);

  // Convert Convex data to our Restaurant type
  const convertedRestaurantData: Restaurant | null = restaurantData && menuItems ? {
    id: restaurantData.restaurantId,
    name: restaurantData.name,
    agentName: restaurantData.agentName,
    menuDetails: menuItems.map(item => ({
      name: item.name,
      price: item.price,
      description: item.description,
    })),
    specialInstructions: restaurantData.specialInstructions,
    languagePreference: restaurantData.languagePreference as 'english' | 'spanish' | 'french',
  } : null;

  return {
    restaurantId,
    restaurantData: convertedRestaurantData,
    loading: loading || (restaurantId && (restaurantData === undefined || menuItems === undefined)),
    saveRestaurantData,
    deleteAllData,
    clearRestaurantId,
  };
}
