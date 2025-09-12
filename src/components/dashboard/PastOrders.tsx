import React, { useState } from "react";
import { Order } from "@/types/global";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useOrders, useCalls } from "@/contexts";
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
  History,
  Eye,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface PastOrdersProps {
  className?: string;
}

const PastOrders: React.FC<PastOrdersProps> = ({ className }) => {
  const {
    state: { pastOrders, loading, error },
  } = useOrders();
  const {
    state: { calls },
  } = useCalls();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

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

  const formatOrderDate = (timestamp: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (timestamp.toDateString() === today.toDateString()) {
      return "Today";
    } else if (timestamp.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return timestamp.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          timestamp.getFullYear() !== today.getFullYear()
            ? "numeric"
            : undefined,
      });
    }
  };

  const handleAnalyzeCall = (order: Order) => {
    if (order.callId) {
      // Navigate to calls section with the specific call ID
      // This will be handled by the parent dashboard component
      const event = new CustomEvent("navigateToCall", {
        detail: { callId: order.callId },
      });
      window.dispatchEvent(event);
    }
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-20", className)}>
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-gray-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <History className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading order history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-xl flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Error Loading Orders
        </h3>
        <p className="text-red-600">Unable to load order history: {error}</p>
      </div>
    );
  }

  if (pastOrders.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-12">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
            <History className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            No Order History Yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
            Completed and cancelled orders will appear here. This helps you
            track your restaurant&apos;s performance and customer satisfaction.
          </p>
          <div className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
            <CheckCircle className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Ready to track orders
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {pastOrders.map((order) => {
        const isCompleted = order.status === "completed";
        const isCancelled = order.status === "cancelled";
        const isExpanded = expandedOrders.has(order.id);

        return (
          <Card
            key={order.id}
            className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden bg-white"
          >
            <CardHeader
              className={cn(
                "border-b border-gray-100 pb-4",
                isCompleted
                  ? "bg-gradient-to-r from-green-50/80 to-white"
                  : "bg-gradient-to-r from-red-50/80 to-white"
              )}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                        isCompleted
                          ? "bg-gradient-to-br from-green-500 to-emerald-600"
                          : "bg-gradient-to-br from-red-500 to-red-600"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <XCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={isCompleted ? "success" : "error"}
                          className={cn(
                            "px-3 py-1 font-medium shadow-sm",
                            isCompleted
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          )}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              COMPLETED
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              CANCELLED
                            </>
                          )}
                        </Badge>
                        <div className="flex items-center space-x-1 text-gray-500 text-sm">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {formatOrderDate(order.timestamp)} at{" "}
                            {formatOrderTime(order.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Basic Info - Always Visible */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Customer:</span>
                  <span className="font-medium text-gray-900">
                    {order.customerName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="font-medium text-gray-900">
                    {order.phoneNumber && order.phoneNumber !== "Unknown"
                      ? order.phoneNumber
                      : "Not Available"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Items:</span>
                  <span className="font-medium text-gray-900">
                    {order.items
                      .slice(0, 2)
                      .map((item) => `${item.quantity}x ${item.name}`)
                      .join(", ")}
                    {order.items.length > 2 &&
                      ` +${order.items.length - 2} more`}
                  </span>
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Cancellation Reason */}
                  {isCancelled && order.cancellationReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-900 text-sm">
                          Cancellation Reason
                        </span>
                      </div>
                      <p className="text-red-800 font-medium">
                        {order.cancellationReason}
                      </p>
                    </div>
                  )}

                  {/* Order Items */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <ShoppingBag className="w-5 h-5 text-gray-600" />
                      <h4 className="text-lg font-semibold text-gray-900">
                        Order Items
                      </h4>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200 font-semibold text-sm text-gray-700">
                                {item.quantity}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.name}
                                </p>
                                {item.specialInstructions && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    Note: {item.specialInstructions}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatCurrency(item.price)} each
                              </p>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-300">
                          <span className="text-lg font-semibold text-gray-900">
                            Total:
                          </span>
                          <span
                            className={cn(
                              "text-xl font-bold",
                              isCompleted ? "text-green-600" : "text-gray-600"
                            )}
                          >
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
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                        <h4 className="text-lg font-semibold text-gray-900">
                          Special Instructions
                        </h4>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-amber-800 font-medium">
                          {order.specialInstructions}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {order.callId && (
                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                        onClick={() => handleAnalyzeCall(order)}
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Call Details</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default PastOrders;
