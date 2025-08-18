"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/onboarding/LoginForm";
import RestaurantSetup from "@/components/onboarding/RestaurantSetup";
import VirtualNumberGenerator from "@/components/onboarding/VirtualNumberGenerator";
import { Restaurant } from "@/types/global";

type OnboardingStep =
  | "login"
  | "restaurant-setup"
  | "virtual-number"
  | "complete";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] =
    useState<OnboardingStep>("restaurant-setup");
  const [restaurantData, setRestaurantData] = useState<Partial<Restaurant>>({});

  const handleRestaurantSetup = async (
    data: Omit<Restaurant, "id" | "virtualNumber">
  ) => {
    // Simulate API call to save restaurant data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setRestaurantData(data);
    console.log("Restaurant setup completed:", data);
    setCurrentStep("virtual-number");
  };

  const handleVirtualNumberComplete = async (virtualNumber: string) => {
    // Simulate API call to save virtual number
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const completeRestaurantData = {
      ...restaurantData,
      virtualNumber,
      id: `restaurant_${Date.now()}`, // Generate a simple ID
    };

    console.log("Onboarding completed:", completeRestaurantData);

    // TODO: update to Convex db
    console.log(completeRestaurantData);
    setCurrentStep("complete");

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "login":
      case "restaurant-setup":
        return <RestaurantSetup onComplete={handleRestaurantSetup} />;

      case "virtual-number":
        return (
          <VirtualNumberGenerator onComplete={handleVirtualNumberComplete} />
        );

      case "complete":
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-8">
              <div className="animate-fade-in">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-100 mb-6">
                  <svg
                    className="h-8 w-8 text-success-600"
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
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
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
