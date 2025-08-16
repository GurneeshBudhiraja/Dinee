# State Management Documentation

This directory contains the React Context-based state management system for the restaurant call management application.

## Overview

The state management system is built using React Context API with useReducer hooks to provide predictable state updates. It consists of three main contexts:

1. **RestaurantContext** - Manages restaurant information and settings
2. **CallsContext** - Manages call data (active and past calls)
3. **OrdersContext** - Manages order data (active and past orders)

## Architecture

### AppProvider

The main provider that wraps all individual context providers and makes them available throughout the application.

```tsx
import { AppProvider } from "@/contexts";

function App() {
  return <AppProvider>{/* Your app components */}</AppProvider>;
}
```

### Individual Contexts

Each context follows the same pattern:

- **State Interface** - Defines the shape of the state
- **Action Types** - Defines all possible state mutations
- **Reducer** - Pure function that handles state updates
- **Context** - React context with state and actions
- **Provider** - Component that provides the context
- **Hook** - Custom hook for consuming the context

## Usage

### Restaurant Context

```tsx
import { useRestaurant } from "@/contexts";

function MyComponent() {
  const { state, actions } = useRestaurant();

  // Access state
  const currentRestaurant = state.currentRestaurant;
  const loading = state.loading;

  // Perform actions
  const handleUpdate = () => {
    actions.updateRestaurant({
      ...currentRestaurant,
      name: "New Name",
    });
  };
}
```

**Available Actions:**

- `setLoading(loading: boolean)` - Set loading state
- `setError(error: string | null)` - Set error state
- `setRestaurants(restaurants: Restaurant[])` - Set all restaurants
- `setCurrentRestaurant(restaurant: Restaurant | null)` - Set current restaurant
- `updateRestaurant(restaurant: Restaurant)` - Update a restaurant
- `createRestaurant(restaurant: Restaurant)` - Create a new restaurant

### Calls Context

```tsx
import { useCalls } from "@/contexts";

function MyComponent() {
  const { state, actions } = useCalls();

  // Access categorized calls
  const activeCalls = state.activeCalls;
  const pastCalls = state.pastCalls;

  // Add a new call
  const handleAddCall = () => {
    actions.addCall({
      id: "call-123",
      phoneNumber: "(555) 123-4567",
      duration: 0,
      status: "active",
      timestamp: new Date(),
    });
  };

  // Complete a call
  const handleCompleteCall = (callId: string) => {
    actions.completeCall(callId, "Final transcript", "positive", "order-123");
  };
}
```

**Available Actions:**

- `setLoading(loading: boolean)` - Set loading state
- `setError(error: string | null)` - Set error state
- `setCalls(calls: Call[])` - Set all calls
- `addCall(call: Call)` - Add a new call
- `updateCall(call: Call)` - Update an existing call
- `deleteCall(callId: string)` - Delete a call
- `updateLiveTranscript(callId: string, transcript: string)` - Update live transcript
- `completeCall(callId, transcript?, sentiment?, orderId?, reason?)` - Complete a call

### Orders Context

```tsx
import { useOrders } from "@/contexts";

function MyComponent() {
  const { state, actions } = useOrders();

  // Access categorized orders
  const activeOrders = state.activeOrders;
  const pastOrders = state.pastOrders;

  // Create a new order
  const handleCreateOrder = () => {
    actions.createOrder({
      phoneNumber: "(555) 123-4567",
      customerName: "John Doe",
      items: [{ id: "1", name: "Pizza", quantity: 1, price: 15.99 }],
      totalAmount: 15.99,
      status: "active",
    });
  };

  // Cancel an order
  const handleCancelOrder = (orderId: string) => {
    actions.cancelOrder(orderId, "Customer requested cancellation");
  };
}
```

**Available Actions:**

- `setLoading(loading: boolean)` - Set loading state
- `setError(error: string | null)` - Set error state
- `setOrders(orders: Order[])` - Set all orders
- `addOrder(order: Order)` - Add a new order
- `updateOrder(order: Order)` - Update an existing order
- `deleteOrder(orderId: string)` - Delete an order
- `cancelOrder(orderId: string, reason: string)` - Cancel an order
- `completeOrder(orderId: string)` - Complete an order
- `createOrder(orderData)` - Create a new order with auto-generated ID

## Data Flow

1. **Initial State** - Each context starts with sample data from `@/lib/constants`
2. **State Updates** - All updates go through reducers for predictable state changes
3. **Automatic Categorization** - Calls and orders are automatically categorized into active/past based on status
4. **Error Handling** - Each context includes loading and error states
5. **Type Safety** - Full TypeScript support with proper type definitions

## Best Practices

1. **Use the custom hooks** - Always use `useRestaurant()`, `useCalls()`, `useOrders()` instead of accessing contexts directly
2. **Handle loading states** - Check `state.loading` before rendering data
3. **Handle errors** - Display `state.error` when present
4. **Immutable updates** - The reducers handle immutability, but always pass complete objects to actions
5. **Batch updates** - Multiple actions can be called in sequence; React will batch the updates

## Integration with Components

The state management is already integrated with the following components:

- `CurrentCalls` - Uses `useCalls()` for active calls
- `PastCalls` - Uses `useCalls()` for past calls
- `CurrentOrders` - Uses `useOrders()` for active orders and order management
- `PastOrders` - Uses `useOrders()` for past orders
- `SettingsSection` - Uses `useRestaurant()` for restaurant settings
- `DashboardPage` - Uses `useRestaurant()` for restaurant name

## Testing

To test the state management, visit `/state-demo` in the application to see an interactive demo of all state operations.
