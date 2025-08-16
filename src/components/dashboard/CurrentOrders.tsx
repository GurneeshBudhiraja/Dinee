import React, { useState } from "react";
import { Order } from "@/types/global";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import CallbackModal from "./CallbackModal";
import OrderCancellationModal from "./OrderCancellationModal";
import { useOrders } from "@/contexts";

export interface CurrentOrdersProps {
  className?: string;
}

const CurrentOrders: React.FC<CurrentOrdersProps> = ({ className }) => {
  const {
    state: { activeOrders: currentOrders, loading, error },
    actions,
  } = useOrders();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const [cancellationModalOpen, setCancellationModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatOrderItems = (order: Order) => {
    return order.items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(", ");
  };

  const handleCallback = (order: Order) => {
    setSelectedOrder(order);
    setCallbackModalOpen(true);
  };

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order);
    setCancellationModalOpen(true);
  };

  const handleCallbackConfirm = async (orderId: string, reason: string) => {
    try {
      actions.setLoading(true);
      // In a real app, this would make an API call
      console.log("Callback confirmed for order:", orderId, "Reason:", reason);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Callback initiated for Order #${orderId}`);
    } catch (error) {
      actions.setError("Failed to initiate callback");
    } finally {
      actions.setLoading(false);
    }
  };

  const handleCancellationConfirm = async (
    orderId: string,
    shouldCallCustomer: boolean,
    reason?: string
  ) => {
    try {
      actions.setLoading(true);

      // Update the order status using the context
      if (reason) {
        actions.cancelOrder(orderId, reason);
      } else {
        actions.cancelOrder(orderId, "Order cancelled by restaurant");
      }

      if (shouldCallCustomer && reason) {
        alert(
          `Order #${orderId} cancelled. Customer will be called with reason: ${reason}`
        );
      } else {
        alert(`Order #${orderId} cancelled without customer notification.`);
      }
    } catch (error) {
      actions.setError("Failed to cancel order");
    } finally {
      actions.setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-gray-400 mb-4">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-red-500 mb-4">Error loading orders: {error}</div>
      </div>
    );
  }

  if (currentOrders.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Current Orders
        </h3>
        <p className="text-gray-500">
          Active orders from customer calls will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {currentOrders.map((order) => {
        const isExpanded = expandedOrders.has(order.id);
        const statusConfig = ORDER_STATUS_CONFIG[order.status];

        return (
          <Card key={order.id} expandable>
            <CardHeader
              expandable
              expanded={isExpanded}
              onToggle={() => toggleOrderExpansion(order.id)}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <Badge variant="info" size="sm">
                      {statusConfig.icon} {statusConfig.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Customer:</span>{" "}
                        {order.customerName}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Items:</span>{" "}
                        {formatOrderItems(order)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Total:</span>{" "}
                        {formatCurrency(order.totalAmount)}
                      </p>
                      {order.specialInstructions && (
                        <p className="text-gray-600">
                          <span className="font-medium">
                            Special Instructions:
                          </span>{" "}
                          {order.specialInstructions}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent>
                <div className="space-y-4">
                  {/* Phone Number */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Contact Information
                    </h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span>{" "}
                      {order.phoneNumber}
                    </p>
                  </div>

                  {/* Detailed Items */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Order Details
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start text-sm"
                        >
                          <div className="flex-1">
                            <p className="text-gray-900">
                              {item.quantity}x {item.name}
                            </p>
                            {item.specialInstructions && (
                              <p className="text-gray-500 text-xs mt-1">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                          <p className="text-gray-900 font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center text-sm font-semibold">
                          <span>Total:</span>
                          <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Management Actions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Order Management
                    </h4>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCallback(order)}
                      >
                        📞 Callback Customer
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelOrder(order)}
                      >
                        ❌ Cancel Order
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
      {/* Modals */}
      <CallbackModal
        isOpen={callbackModalOpen}
        onClose={() => setCallbackModalOpen(false)}
        order={selectedOrder}
        onConfirm={handleCallbackConfirm}
      />

      <OrderCancellationModal
        isOpen={cancellationModalOpen}
        onClose={() => setCancellationModalOpen(false)}
        order={selectedOrder}
        onConfirm={handleCancellationConfirm}
      />
    </div>
  );
};

export default CurrentOrders;
