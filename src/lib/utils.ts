import { Call, Order, OrderItem, SentimentType, CallStatus, OrderStatus } from '@/types/global';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Time and date formatting utilities
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

// Currency formatting
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Phone number formatting
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Return original if not 10 digits
  return phoneNumber;
}

// Generate random phone number
export function generatePhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100; // 100-999
  const exchange = Math.floor(Math.random() * 900) + 100; // 100-999
  const number = Math.floor(Math.random() * 9000) + 1000; // 1000-9999

  return `(${areaCode}) ${exchange}-${number}`;
}

// Order calculations
export function calculateOrderTotal(items: OrderItem[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function getOrderItemCount(items: OrderItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

// Data filtering and sorting utilities
export function filterCallsByStatus(calls: Call[], status: CallStatus): Call[] {
  return calls.filter(call => call.status === status);
}

export function filterOrdersByStatus(orders: Order[], status: OrderStatus): Order[] {
  return orders.filter(order => order.status === status);
}

export function sortCallsByTimestamp(calls: Call[], ascending: boolean = false): Call[] {
  return [...calls].sort((a, b) => {
    const timeA = a.timestamp.getTime();
    const timeB = b.timestamp.getTime();
    return ascending ? timeA - timeB : timeB - timeA;
  });
}

export function sortOrdersByTimestamp(orders: Order[], ascending: boolean = false): Order[] {
  return [...orders].sort((a, b) => {
    const timeA = a.timestamp.getTime();
    const timeB = b.timestamp.getTime();
    return ascending ? timeA - timeB : timeB - timeA;
  });
}

// Search and filtering
export function searchCallsByPhoneNumber(calls: Call[], phoneNumber: string): Call[] {
  const searchTerm = phoneNumber.toLowerCase().replace(/\D/g, '');
  return calls.filter(call =>
    call.phoneNumber.replace(/\D/g, '').includes(searchTerm)
  );
}

export function searchOrdersByCustomerName(orders: Order[], customerName: string): Order[] {
  const searchTerm = customerName.toLowerCase();
  return orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm)
  );
}

// Validation utilities
export function isValidPhoneNumber(phoneNumber: string): boolean {
  const digits = phoneNumber.replace(/\D/g, '');
  return digits.length === 10;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateOrderItem(item: Partial<OrderItem>): string[] {
  const errors: string[] = [];

  if (!item.name || item.name.trim().length === 0) {
    errors.push('Item name is required');
  }

  if (!item.quantity || item.quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }

  if (!item.price || item.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  return errors;
}

// Text processing utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatOrderSummary(items: OrderItem[]): string {
  if (items.length === 0) return 'No items';
  if (items.length === 1) return items[0].name;
  if (items.length === 2) return `${items[0].name} and ${items[1].name}`;
  return `${items[0].name} and ${items.length - 1} other item${items.length > 2 ? 's' : ''}`;
}

// Status helpers
export function getCallStatusColor(status: CallStatus): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'active':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getSentimentColor(sentiment: SentimentType): string {
  switch (sentiment) {
    case 'positive':
      return 'bg-green-100 text-green-800';
    case 'neutral':
      return 'bg-gray-100 text-gray-800';
    case 'negative':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// ID generation utilities
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${randomStr}`;
}

export function generateCallId(): string {
  return generateId('call');
}

export function generateOrderId(): string {
  return generateId('order');
}

export function generateOrderItemId(): string {
  return generateId('item');
}