import React, { useState } from "react";
import { Order } from "@/types/global";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { NGROK_URL } from "@/lib/constants";
import { useRestaurantStorage } from "@/hooks/useRestaurantStorage";

export interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirm: (orderId: string, reason: string) => void;
}

const CallbackModal: React.FC<CallbackModalProps> = ({
  isOpen,
  onClose,
  order,
  onConfirm,
}) => {
  const TOTAL_CHAR_COUNT = 10;
  const { restaurantData } = useRestaurantStorage();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order || reason.trim().length < TOTAL_CHAR_COUNT) {
      return;
    }

    setIsSubmitting(true);
    try {
      onConfirm(order.id, reason.trim());
      const requestBody = {
        phoneNumber: order.phoneNumber,
        data: `<agent_name>${restaurantData.agentName}</agent_name>
        <restaurant_name>${restaurantData.name}</restaurant_name>
        <restaurant_id>${restaurantData.id}</restaurant_id>
        <order_details>${order.items}</order_details>
        <order_id>${order.id}</order_id>
        <customer_name>${order.customerName}</customer_name>
        <reason>${reason}</reason>`,
        reason: "followup",
      };
      console.log("Making a callback");
      await fetch(`${NGROK_URL}/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      handleClose();
    } catch (error) {
      console.error("Error submitting callback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setIsSubmitting(false);
    onClose();
  };

  const isReasonValid = reason.trim().length >= TOTAL_CHAR_COUNT;
  const characterCount = reason.trim().length;

  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Callback Customer"
      description={`Initiate a callback for Order #${order.id} - ${order.customerName}`}
      size="lg"
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
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
          </div>
        </div>

        <div>
          <label
            htmlFor="callback-reason"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Reason for Callback <span className="text-red-500">*</span>
          </label>
          <textarea
            id="callback-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a detailed reason for the callback (minimum 100 characters)..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isSubmitting}
            required
          />
          <div className="flex justify-between items-center mt-2">
            <p
              className={`text-sm ${
                characterCount < TOTAL_CHAR_COUNT
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {characterCount}/{TOTAL_CHAR_COUNT} characters minimum
            </p>
            {characterCount > 0 && characterCount < TOTAL_CHAR_COUNT && (
              <p className="text-sm text-red-500">
                {TOTAL_CHAR_COUNT - characterCount} more characters needed
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isReasonValid || isSubmitting}
            loading={isSubmitting}
          >
            Initiate Callback
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CallbackModal;
