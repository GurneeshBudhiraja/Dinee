import React, { useState } from "react";
import { Order } from "@/types/global";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { NGROK_URL, SERVER_URL } from "@/lib/constants";
import { useRestaurant } from "@/contexts";
import { useRestaurantStorage } from "@/hooks/useRestaurantStorage";

export interface OrderCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirm: (
    orderId: string,
    shouldCallCustomer: boolean,
    reason?: string
  ) => void;
}

type CancellationStep = "confirm" | "reason";

const CHARS_COUNT = 10;

const OrderCancellationModal: React.FC<OrderCancellationModalProps> = ({
  isOpen,
  onClose,
  order,
  onConfirm,
}) => {
  const [step, setStep] = useState<CancellationStep>("confirm");
  const [shouldCallCustomer, setShouldCallCustomer] = useState<boolean | null>(
    null
  );
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { restaurantData } = useRestaurantStorage();

  const handleClose = () => {
    setStep("confirm");
    setShouldCallCustomer(null);
    setReason("");
    setIsSubmitting(false);
    onClose();
  };

  const handleCustomerCallDecision = (willCall: boolean) => {
    setShouldCallCustomer(willCall);
    if (willCall) {
      setStep("reason");
    } else {
      // If not calling customer, proceed directly to cancellation
      handleFinalConfirmation(false, "");
    }
  };

  const handleReasonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (reason.trim().length < CHARS_COUNT) {
      return;
    }
    await handleFinalConfirmation(true, reason.trim());
    const requestBody = {
      phoneNumber: order.phoneNumber,
      data: `<agent_name>${restaurantData.agentName}</agent_name>
      <restaurant_name>${restaurantData.name}</restaurant_name>
      <restaurant_id>${restaurantData.id}</restaurant_id>
      <order_details>${order.items}</order_details>
      <order_id>${order.id}</order_id>
      <customer_name>${order.customerName}</customer_name>
      <reason>${reason}</reason>`,
      reason: "cancellation",
    };
    console.log("Sending the request to the ");
    await fetch(`${NGROK_URL}/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
  };

  const handleFinalConfirmation = async (
    callCustomer: boolean,
    cancellationReason: string
  ) => {
    if (!order) return;

    setIsSubmitting(true);
    try {
      await onConfirm(order.id, callCustomer, cancellationReason);
      handleClose();
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReasonValid = reason.trim().length >= CHARS_COUNT;
  const characterCount = reason.trim().length;

  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cancel Order"
      description={
        step === "confirm"
          ? `Are you sure you want to cancel Order #${order.id}?`
          : `Provide cancellation reason for Order #${order.id}`
      }
      size="lg"
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      {step === "confirm" && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Order Information
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Customer:</span>{" "}
                {order.customerName}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.phoneNumber}
              </p>
              <p>
                <span className="font-medium">Total:</span> $
                {order.totalAmount.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Items:</span>{" "}
                {order.items
                  .map((item) => `${item.quantity}x ${item.name}`)
                  .join(", ")}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">
              Do you want to call and inform the customer about the
              cancellation?
            </h4>
            <p className="text-sm text-yellow-700 mb-4">
              This will help maintain good customer service and explain the
              reason for cancellation.
            </p>

            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => handleCustomerCallDecision(true)}
                disabled={isSubmitting}
              >
                📞 Yes, Call Customer
              </Button>
              <Button
                variant="outline"
                onClick={() => handleCustomerCallDecision(false)}
                disabled={isSubmitting}
              >
                No, Cancel Without Calling
              </Button>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Keep Order Active
            </Button>
          </div>
        </div>
      )}

      {step === "reason" && (
        <form onSubmit={handleReasonSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Order Information
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Customer:</span>{" "}
                {order.customerName}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.phoneNumber}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="cancellation-reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for Cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              id="cancellation-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a detailed reason for the cancellation that will be communicated to the customer (minimum 100 characters)..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isSubmitting}
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p
                className={`text-sm ${
                  characterCount < CHARS_COUNT
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {characterCount}/{CHARS_COUNT} characters minimum
              </p>
              {characterCount > 0 && characterCount < CHARS_COUNT && (
                <p className="text-sm text-red-500">
                  {CHARS_COUNT - characterCount} more characters needed
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("confirm")}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!isReasonValid || isSubmitting}
              loading={isSubmitting}
            >
              Cancel Order & Call Customer
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default OrderCancellationModal;
