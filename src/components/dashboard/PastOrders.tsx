import React, { useState } from "react";
import { Order } from "@/types/global";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useOrders, useCalls } from "@/contexts";

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

  const formatOrderItems = (order: Order) => {
    return order.items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(", ");
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "neutral";
    }
  };

  const handleAnalyzeCall = (order: Order) => {
    if (order.callId) {
      // In a real app, this would navigate to the call details
      // For now, we'll show an alert with call information
      const call = calls.find((c) => c.id === order.callId);
      if (call) {
        alert(
          `Analyzing call ${order.callId}:\n\nPhone: ${
            call.phoneNumber
          }\nDuration: ${Math.floor(call.duration / 60)}:${(call.duration % 60)
            .toString()
            .padStart(2, "0")}\nSentiment: ${
            call.sentiment || "N/A"
          }\n\nThis would navigate to the call details in a real implementation.`
        );
      } else {
        alert(`Call ${order.callId} not found in current data.`);
      }
    }
  };

  if (loading) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-gray-400 mb-4">Loading past orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-red-500 mb-4">
          Error loading past orders: {error}
        </div>
      </div>
    );
  }

  if (pastOrders.length === 0) {
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
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Past Orders
        </h3>
        <p className="text-gray-500">
          Completed and cancelled orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {pastOrders.map((order) => {
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
                    <Badge variant={getBadgeVariant(order.status)} size="sm">
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
                      <p className="text-gray-600">
                        <span className="font-medium">Date:</span>{" "}
                        {order.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {order.status === "cancelled" && order.cancellationReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-800">
                        <span className="font-medium">
                          Cancellation Reason:
                        </span>{" "}
                        {order.cancellationReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent>
                <div className="space-y-4">
                  {/* Contact Information */}
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

                  {/* Special Instructions */}
                  {order.specialInstructions && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Special Instructions
                      </h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {order.specialInstructions}
                      </p>
                    </div>
                  )}

                  {/* Order Analysis */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Order Analysis
                    </h4>
                    <div className="flex gap-3">
                      {order.callId ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAnalyzeCall(order)}
                        >
                          📞 Analyze Call
                        </Button>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No associated call data available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                    <div className="text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Order Placed:</span>{" "}
                        {order.timestamp.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={cn(
                            "font-medium",
                            order.status === "completed"
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {statusConfig.label}
                        </span>
                      </p>
                    </div>
                  </div>
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
