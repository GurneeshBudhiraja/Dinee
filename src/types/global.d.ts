// Global type definitions for the restaurant call management application

export interface User {
  id: string;
  email: string;
  restaurantId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  agentName: string;
  menuDetails: string;
  specialInstructions: string;
  languagePreference: string;
  virtualNumber?: string;
}

export interface Call {
  id: string;
  phoneNumber: string;
  duration: number; // in seconds
  status: "active" | "completed";
  transcript?: string;
  liveTranscript?: string;
  orderId?: string;
  sentiment?: "positive" | "neutral" | "negative";
  reason?: string; // if no order placed
  timestamp: Date;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  callId?: string;
  phoneNumber: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  specialInstructions?: string;
  status: "active" | "completed" | "cancelled";
  timestamp: Date;
  cancellationReason?: string;
}

// Additional utility types
export type CallStatus = "active" | "completed";
export type OrderStatus = "active" | "completed" | "cancelled";
export type SentimentType = "positive" | "neutral" | "negative";
export type LanguagePreference = "english" | "spanish" | "french";