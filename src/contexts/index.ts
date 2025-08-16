// Export all context providers and hooks
export { AppProvider, useRestaurant, useCalls, useOrders } from './AppProvider';
export { RestaurantProvider } from './RestaurantContext';
export { CallsProvider } from './CallsContext';
export { OrdersProvider } from './OrdersContext';

// Export types for external use
export type { Restaurant, Call, Order, OrderItem } from '@/types/global';