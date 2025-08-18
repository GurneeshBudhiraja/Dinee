"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface VirtualNumberGeneratorProps {
  onComplete: (virtualNumber: string) => Promise<void>;
  loading?: boolean;
}

const VirtualNumberGenerator: React.FC<VirtualNumberGeneratorProps> = ({
  onComplete,
  loading = false,
}) => {
  const [virtualNumber, setVirtualNumber] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProceeding, setIsProceeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateVirtualNumber = (): string => {
    // Generate a random 10-digit phone number
    // Format: (XXX) XXX-XXXX
    const areaCode = Math.floor(Math.random() * 900) + 100; // 100-999
    const exchange = Math.floor(Math.random() * 900) + 100; // 100-999
    const number = Math.floor(Math.random() * 9000) + 1000; // 1000-9999

    return `(${areaCode}) ${exchange}-${number}`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Simulate API call delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newNumber = generateVirtualNumber();
      setVirtualNumber(newNumber);
    } catch (err) {
      setError("Failed to generate virtual number. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProceed = async () => {
    if (!virtualNumber) return;

    setIsProceeding(true);
    setError(null);

    try {
      await onComplete(virtualNumber);
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

  const handleRegenerateNumber = () => {
    setVirtualNumber(null);
    handleGenerate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Virtual Phone Number
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Generate a virtual number for your AI agent
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">
              Get Your Virtual Number
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {error && (
                <div
                  className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-6">
                  This virtual number will be used by customers to call your AI
                  agent. Your agent will handle orders and customer inquiries
                  automatically.
                </p>

                {!virtualNumber ? (
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-8 border-2 border-dashed border-gray-300">
                      <div className="text-gray-400 text-center">
                        <svg
                          className="mx-auto h-12 w-12 mb-4"
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
                        <p className="text-sm">
                          Click generate to get your virtual number
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleGenerate}
                      loading={isGenerating}
                      disabled={isGenerating || loading}
                      className="w-full"
                    >
                      {isGenerating
                        ? "Generating..."
                        : "Generate Virtual Number"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm text-blue-700 mb-2">
                          Your Virtual Number
                        </p>
                        <p
                          className="text-2xl font-mono font-bold text-primary-900"
                          aria-label={`Virtual phone number: ${virtualNumber
                            .replace(/[()]/g, "")
                            .replace(/-/g, "")}`}
                        >
                          {virtualNumber}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        What happens next?
                      </h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>
                          • Customers can call this number to place orders
                        </li>
                        <li>• Your AI agent will handle calls automatically</li>
                        <li>
                          • You&apos;ll monitor all calls from your dashboard
                        </li>
                      </ul>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={handleRegenerateNumber}
                        disabled={isGenerating || isProceeding || loading}
                        className="flex-1"
                      >
                        Generate New Number
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleProceed}
                        loading={isProceeding}
                        disabled={isGenerating || isProceeding || loading}
                        className="flex-1"
                      >
                        {isProceeding
                          ? "Setting up..."
                          : "Continue to Dashboard"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {virtualNumber && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Make sure to save this number. You can find it later in your
              dashboard settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualNumberGenerator;
