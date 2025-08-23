"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RestaurantSetup from "@/components/onboarding/RestaurantSetup";
import RestaurantIdDisplay from "@/components/onboarding/VirtualNumberGenerator";
import { useRestaurantStorage } from "@/hooks/useRestaurantStorage";
import { Restaurant } from "@/types/global";

type OnboardingStep = "restaurant-setup" | "restaurant-id" | "complete";

export default function OnboardingPage() {
  const router = useRouter();
  const { restaurantId } = useRestaurantStorage();
  const [currentStep, setCurrentStep] =
    useState<OnboardingStep>("restaurant-setup");
  const [generatedRestaurantId, setGeneratedRestaurantId] =
    useState<string>("");

  // Check if user already has a restaurant ID and redirect to dashboard
  useEffect(() => {
    if (restaurantId) {
      router.push("/client/dashboard");
    }
  }, [restaurantId, router]);

  const handleRestaurantSetup = async (restaurantId: string) => {
    setGeneratedRestaurantId(restaurantId);
    setCurrentStep("restaurant-id");
  };

  const handleComplete = async () => {
    setCurrentStep("complete");

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push("/client/dashboard");
    }, 1500);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "restaurant-setup":
        return <RestaurantSetup onComplete={handleRestaurantSetup} />;

      case "restaurant-id":
        return (
          <RestaurantIdDisplay
            restaurantId={generatedRestaurantId}
            onComplete={handleComplete}
          />
        );

      case "complete":
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-8">
              <div>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Setup Complete!
                </h1>
                <p className="text-gray-600 mb-6">
                  Your restaurant AI agent is now ready to handle calls.
                  Redirecting you to the dashboard...
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderCurrentStep();
}
