"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Order, OrderItem } from "@/types/global";
import { SAMPLE_ORDERS } from "@/lib/constants";

// State interface
interface OrdersState {
  orders: Order[];
  activeOrders: Order[];
  pastOrders: Order[];
  loading: boolean;
  error: string | null;
}

// Action types
type OrdersAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: Order }
  | { type: "DELETE_ORDER"; payload: string }
  | { type: "CANCEL_ORDER"; payload: { orderId: string; reason: string } }
  | { type: "COMPLETE_ORDER"; payload: string };

// Helper function to categorize orders
function categorizeOrders(orders: Order[]) {
  const activeOrders = orders.filter((order) => order.status === "active");
  const pastOrders = orders.filter(
    (order) => order.status === "completed" || order.status === "cancelled"
  );
  return { activeOrders, pastOrders };
}

// Initial state
const initialOrders = SAMPLE_ORDERS;
const { activeOrders, pastOrders } = categorizeOrders(initialOrders);

const initialState: OrdersState = {
  orders: initialOrders,
  activeOrders,
  pastOrders,
  loading: false,
  error: null,
};

// Reducer
function ordersReducer(state: OrdersState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_ORDERS": {
      const { activeOrders, pastOrders } = categorizeOrders(action.payload);
      return {
        ...state,
        orders: action.payload,
        activeOrders,
        pastOrders,
        loading: false,
        error: null,
      };
    }

    case "ADD_ORDER": {
      const updatedOrders = [...state.orders, action.payload];
      const { activeOrders, pastOrders } = categorizeOrders(updatedOrders);
      return {
        ...state,
        orders: updatedOrders,
        activeOrders,
        pastOrders,
        loading: false,
        error: null,
      };
    }

    case "UPDATE_ORDER": {
      const updatedOrders = state.orders.map((order) =>
        order.id === action.payload.id ? action.payload : order
      );
      const { activeOrders, pastOrders } = categorizeOrders(updatedOrders);
      return {
        ...state,
        orders: updatedOrders,
        activeOrders,
        pastOrders,
        loading: false,
        error: null,
      };
    }

    case "DELETE_ORDER": {
      const updatedOrders = state.orders.filter(
        (order) => order.id !== action.payload
      );
      const { activeOrders, pastOrders } = categorizeOrders(updatedOrders);
      return {
        ...state,
        orders: updatedOrders,
        activeOrders,
        pastOrders,
        loading: false,
        error: null,
      };
    }

    case "CANCEL_ORDER": {
      const updatedOrders = state.orders.map((order) =>
        order.id === action.payload.orderId
          ? {
              ...order,
              status: "cancelled" as const,
              cancellationReason: action.payload.reason,
            }
          : order
      );
      const { activeOrders, pastOrders } = categorizeOrders(updatedOrders);
      return {
        ...state,
        orders: updatedOrders,
        activeOrders,
        pastOrders,
        loading: false,
        error: null,
      };
    }

    case "COMPLETE_ORDER": {
      const updatedOrders = state.orders.map((order) =>
        order.id === action.payload
          ? { ...order, status: "completed" as const }
          : order
      );
      const { activeOrders, pastOrders } = categorizeOrders(updatedOrders);
      return {
        ...state,
        orders: updatedOrders,
        activeOrders,
        pastOrders,
        loading: false,
        error: null,
      };
    }

    default:
      return state;
  }
}

// Context
interface OrdersContextType {
  state: OrdersState;
  actions: {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setOrders: (orders: Order[]) => void;
    addOrder: (order: Order) => void;
    updateOrder: (order: Order) => void;
    deleteOrder: (orderId: string) => void;
    cancelOrder: (orderId: string, reason: string) => void;
    completeOrder: (orderId: string) => void;
    createOrder: (orderData: Omit<Order, "id" | "timestamp">) => void;
  };
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// Provider component
interface OrdersProviderProps {
  children: ReactNode;
}

export function OrdersProvider({ children }: OrdersProviderProps) {
  const [state, dispatch] = useReducer(ordersReducer, initialState);

  const actions = {
    setLoading: (loading: boolean) =>
      dispatch({ type: "SET_LOADING", payload: loading }),
    setError: (error: string | null) =>
      dispatch({ type: "SET_ERROR", payload: error }),
    setOrders: (orders: Order[]) =>
      dispatch({ type: "SET_ORDERS", payload: orders }),
    addOrder: (order: Order) => dispatch({ type: "ADD_ORDER", payload: order }),
    updateOrder: (order: Order) =>
      dispatch({ type: "UPDATE_ORDER", payload: order }),
    deleteOrder: (orderId: string) =>
      dispatch({ type: "DELETE_ORDER", payload: orderId }),
    cancelOrder: (orderId: string, reason: string) =>
      dispatch({ type: "CANCEL_ORDER", payload: { orderId, reason } }),
    completeOrder: (orderId: string) =>
      dispatch({ type: "COMPLETE_ORDER", payload: orderId }),

    createOrder: (orderData: Omit<Order, "id" | "timestamp">) => {
      const newOrder: Order = {
        ...orderData,
        id: `order-${Date.now()}`,
        timestamp: new Date(),
      };
      dispatch({ type: "ADD_ORDER", payload: newOrder });
    },
  };

  return (
    <OrdersContext.Provider value={{ state, actions }}>
      {children}
    </OrdersContext.Provider>
  );
}

// Hook to use the context
export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
