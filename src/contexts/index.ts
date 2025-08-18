// Export all context providers and hooks
export { AppProvider, useCalls, useOrders } from './AppProvider';
export { CallsProvider } from './CallsContext';
export { OrdersProvider } from './OrdersContext';


// Export types for external use
export type { Restaurant, Call, Order, OrderItem } from '@/types/global';
