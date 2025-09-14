import React, { useState } from "react";
import { Order } from "@/types/global";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import CallbackModal from "./CallbackModal";
import OrderCancellationModal from "./OrderCancellationModal";
import { useOrders } from "@/contexts";
import {
  Clock,
  Phone,
  User,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  ChefHat,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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

  const formatOrderTime = (timestamp: Date) => {
    return timestamp.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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
      <div className="flex items-center justify-center py-16">
        <div className="bg-black border border-gray-800 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-700 border-t-emerald-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag className="w-3 h-3 text-emerald-500" />
              </div>
            </div>
            <p className="text-gray-400 text-sm">Loading current orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black border border-red-500/30 rounded-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-lg flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          Error Loading Orders
        </h3>
        <p className="text-gray-400 text-sm">
          Unable to load current orders: {error}
        </p>
      </div>
    );
  }

  if (currentOrders.length === 0) {
    return (
      <div className="bg-gray-900/30 border border-gray-700 rounded-xl p-12">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-xl flex items-center justify-center border border-gray-600">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            No Active Orders
          </h3>
          <p className="text-gray-300 max-w-md mx-auto mb-6 leading-relaxed text-sm">
            When customers place orders through calls, they&apos;ll appear here
            for you to manage and fulfill.
          </p>
          <div className="inline-flex items-center space-x-3 bg-emerald-500/10 px-6 py-3 rounded-lg border border-emerald-500/20">
            <ChefHat className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              Ready to receive orders
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {currentOrders.map((order) => {
        const isExpanded = expandedOrders.has(order.id);

        return (
          <div
            key={order.id}
            className="bg-gray-900/30 border border-gray-700 hover:border-gray-600 transition-all duration-200 rounded-xl overflow-hidden"
          >
            <div className="bg-white/5 border-b border-gray-700 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                      <ShoppingBag className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        Order #{order.id}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant="success"
                          className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-2.5 py-1 text-xs font-medium"
                        >
                          <CheckCircle className="w-3 h-3 mr-1.5" />
                          ACTIVE
                        </Badge>
                        <div className="flex items-center space-x-1.5 text-gray-300 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatOrderTime(order.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <div className="text-xs text-gray-300">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-300" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Basic Info - Always Visible */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="bg-white/5 border border-gray-600 rounded-lg p-3">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <User className="w-3.5 h-3.5 text-gray-300" />
                    <span className="font-medium text-gray-300 text-xs">
                      Customer
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white">
                    {order.customerName}
                  </div>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-medium text-emerald-400 text-xs">
                      Phone
                    </span>
                  </div>
                  <div className="text-sm font-medium text-emerald-400">
                    {order.phoneNumber && order.phoneNumber !== "Unknown"
                      ? order.phoneNumber
                      : "Not Available"}
                  </div>
                </div>
                <div className="bg-white/5 border border-gray-600 rounded-lg p-3">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-gray-300" />
                    <span className="font-medium text-gray-300 text-xs">
                      Items
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white">
                    {order.items
                      .slice(0, 2)
                      .map((item) => `${item.quantity}x ${item.name}`)
                      .join(", ")}
                    {order.items.length > 2 &&
                      ` +${order.items.length - 2} more`}
                  </div>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="p-6">
                <div className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-1.5 bg-white/5 rounded-lg border border-gray-600">
                        <ShoppingBag className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h4 className="text-sm font-medium text-white">
                        Order Items
                      </h4>
                    </div>
                    <div className="bg-white/5 border border-gray-600 rounded-lg p-4">
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center border border-gray-600 font-medium text-xs text-white">
                                {item.quantity}
                              </div>
                              <div>
                                <p className="font-medium text-white text-sm">
                                  {item.name}
                                </p>
                                {item.specialInstructions && (
                                  <p className="text-xs text-gray-300 mt-1">
                                    Note: {item.specialInstructions}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-white text-sm">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                              <p className="text-xs text-gray-300">
                                {formatCurrency(item.price)} each
                              </p>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-600">
                          <span className="text-sm font-medium text-white">
                            Total:
                          </span>
                          <span className="text-sm font-medium text-emerald-400">
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {order.specialInstructions && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="p-1.5 bg-white/5 rounded-lg border border-gray-600">
                          <MessageSquare className="w-3.5 h-3.5 text-white" />
                        </div>
                        <h4 className="text-sm font-medium text-white">
                          Special Instructions
                        </h4>
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                        <p className="text-emerald-400 font-medium text-sm">
                          {order.specialInstructions}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-700">
                    <button
                      className="bg-white/5 border border-gray-600 text-white hover:bg-white/10 hover:border-gray-500 px-3 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 text-xs font-medium transition-all duration-200 cursor-pointer"
                      onClick={() => handleCallback(order)}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Customer</span>
                    </button>
                    <button
                      className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 px-3 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 text-xs font-medium transition-all duration-200 cursor-pointer"
                      onClick={() => handleCancelOrder(order)}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Order</span>
                    </button>
                    <button
                      className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 text-xs font-medium transition-all duration-200 cursor-pointer"
                      onClick={() => actions.completeOrder(order.id)}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark Complete</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
