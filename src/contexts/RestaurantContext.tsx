"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Restaurant } from "@/types/global";
import { SAMPLE_RESTAURANTS } from "@/lib/constants";

// State interface
interface RestaurantState {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
}

// Action types
type RestaurantAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_RESTAURANTS"; payload: Restaurant[] }
  | { type: "SET_CURRENT_RESTAURANT"; payload: Restaurant | null }
  | { type: "UPDATE_RESTAURANT"; payload: Restaurant }
  | { type: "CREATE_RESTAURANT"; payload: Restaurant };

// Initial state
const initialState: RestaurantState = {
  restaurants: SAMPLE_RESTAURANTS,
  currentRestaurant: SAMPLE_RESTAURANTS[0] || null,
  loading: false,
  error: null,
};

// Reducer
function restaurantReducer(
  state: RestaurantState,
  action: RestaurantAction
): RestaurantState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_RESTAURANTS":
      return {
        ...state,
        restaurants: action.payload,
        loading: false,
        error: null,
      };

    case "SET_CURRENT_RESTAURANT":
      return { ...state, currentRestaurant: action.payload };

    case "UPDATE_RESTAURANT":
      const updatedRestaurants = state.restaurants.map((restaurant) =>
        restaurant.id === action.payload.id ? action.payload : restaurant
      );
      const updatedCurrent =
        state.currentRestaurant?.id === action.payload.id
          ? action.payload
          : state.currentRestaurant;

      return {
        ...state,
        restaurants: updatedRestaurants,
        currentRestaurant: updatedCurrent,
        loading: false,
        error: null,
      };

    case "CREATE_RESTAURANT":
      return {
        ...state,
        restaurants: [...state.restaurants, action.payload],
        currentRestaurant: action.payload,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
}

// Context
interface RestaurantContextType {
  state: RestaurantState;
  actions: {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setRestaurants: (restaurants: Restaurant[]) => void;
    setCurrentRestaurant: (restaurant: Restaurant | null) => void;
    updateRestaurant: (restaurant: Restaurant) => void;
    createRestaurant: (restaurant: Restaurant) => void;
  };
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

// Provider component
interface RestaurantProviderProps {
  children: ReactNode;
}

export function RestaurantProvider({ children }: RestaurantProviderProps) {
  const [state, dispatch] = useReducer(restaurantReducer, initialState);

  const actions = {
    setLoading: (loading: boolean) =>
      dispatch({ type: "SET_LOADING", payload: loading }),
    setError: (error: string | null) =>
      dispatch({ type: "SET_ERROR", payload: error }),
    setRestaurants: (restaurants: Restaurant[]) =>
      dispatch({ type: "SET_RESTAURANTS", payload: restaurants }),
    setCurrentRestaurant: (restaurant: Restaurant | null) =>
      dispatch({ type: "SET_CURRENT_RESTAURANT", payload: restaurant }),
    updateRestaurant: (restaurant: Restaurant) =>
      dispatch({ type: "UPDATE_RESTAURANT", payload: restaurant }),
    createRestaurant: (restaurant: Restaurant) =>
      dispatch({ type: "CREATE_RESTAURANT", payload: restaurant }),
  };

  return (
    <RestaurantContext.Provider value={{ state, actions }}>
      {children}
    </RestaurantContext.Provider>
  );
}

// Hook to use the context
export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}
