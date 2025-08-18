"use client";

import { useState, useEffect, useCallback } from "react";
import { Restaurant } from "@/types/global";

const RESTAURANT_DATA_KEY = "restaurantData";

/**
 * Custom hook to manage restaurant data in local storage.
 * @returns An object with functions to interact with the restaurant data.
 */
export function useRestaurantStorage() {
  const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  const getRestaurantData = useCallback(() => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem(RESTAURANT_DATA_KEY);
      if (storedData) {
        const data: Restaurant = JSON.parse(storedData);
        setRestaurantData(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error("Failed to get restaurant data from storage", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveRestaurantData = useCallback((data: Restaurant) => {
    try {
      localStorage.setItem(RESTAURANT_DATA_KEY, JSON.stringify(data));
      setRestaurantData(data);
    } catch (error) {
      console.error("Failed to save restaurant data to storage", error);
    }
  }, []);

  const deleteRestaurantData = useCallback(() => {
    try {
      localStorage.removeItem(RESTAURANT_DATA_KEY);
      setRestaurantData(null);
    } catch (error) {
      console.error("Failed to delete restaurant data from storage", error);
    }
  }, []);

  useEffect(() => {
    getRestaurantData();
  }, [getRestaurantData]);

  return {
    restaurantData,
    loading,
    getRestaurantData,
    saveRestaurantData,
    deleteRestaurantData,
  };
}
