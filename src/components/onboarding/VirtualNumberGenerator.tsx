"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface RestaurantIdDisplayProps {
  restaurantId: string;
  onComplete: () => Promise<void>;
  loading?: boolean;
}

const RestaurantIdDisplay: React.FC<RestaurantIdDisplayProps> = ({
  restaurantId,
  onComplete,
  loading = false,
}) => {
  const PHONE_NUMBER =
    process.env.NEXT_PUBLIC_VIRTUAL_NUMBER || "(555) 123-4567";
  const [isProceeding, setIsProceeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProceed = async () => {
    setIsProceeding(true);
    setError(null);

    try {
      await onComplete();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to proceed. Please try again."
      );
    } finally {
      setIsProceeding(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Setup Complete!</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your restaurant is now ready to receive AI-powered calls
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">
              Your Restaurant Details
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {error && (
                <div
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Restaurant ID */}
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-8 w-8 text-blue-600 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-sm text-blue-700 mb-2">
                      Your Restaurant ID
                    </p>
                    <p className="text-3xl font-mono font-bold text-blue-900 tracking-wider">
                      {restaurantId}
                    </p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-8 w-8 text-green-600 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <p className="text-sm text-green-700 mb-2">
                      AI Agent Phone Number
                    </p>
                    <p className="text-2xl font-mono font-bold text-green-900">
                      {PHONE_NUMBER}
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h3 className="text-sm font-medium text-amber-900 mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Important Instructions for Your Customers
                  </h3>
                  <div className="text-sm text-amber-800 space-y-2">
                    <p className="font-medium">Tell your customers to:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>
                        Call{" "}
                        <span className="font-mono font-bold">
                          {PHONE_NUMBER}
                        </span>
                      </li>
                      <li>
                        When prompted, provide Restaurant ID:{" "}
                        <span className="font-mono font-bold">
                          {restaurantId}
                        </span>
                      </li>
                      <li>Place their order with the AI agent</li>
                    </ol>
                  </div>
                </div>

                {/* What happens next */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    What happens next?
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • Customers call the number and provide your Restaurant ID
                    </li>
                    <li>• Your AI agent handles orders automatically</li>
                    <li>• Monitor all calls and orders from your dashboard</li>
                    <li>• Update menu and settings anytime</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    onClick={handleProceed}
                    loading={isProceeding}
                    disabled={isProceeding || loading}
                    className="flex-1"
                  >
                    {isProceeding ? "Setting up..." : "Go to Dashboard"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Save your Restaurant ID{" "}
            <span className="font-mono font-bold">{restaurantId}</span> -
            you&apos;ll need it to access your dashboard and customers will need
            it to place orders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantIdDisplay;
