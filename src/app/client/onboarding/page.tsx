"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import RestaurantSetup from "@/components/onboarding/RestaurantSetup";
import RestaurantIdDisplay from "@/components/onboarding/VirtualNumberGenerator";
import { useRestaurantStorage } from "@/hooks/useRestaurantStorage";
import { MinimalHeader } from "@/components/ui/Header";

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
    // Ensure page loads at top
    window.scrollTo(0, 0);
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
          <div className="min-h-screen bg-black text-white overflow-hidden relative">
            <MinimalHeader />
            <div className="flex items-center justify-center min-h-screen px-6 py-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-md w-full text-center space-y-8 relative z-10"
              >
                <div className="glass-card rounded-2xl p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-white">
                      Setup Complete!
                    </h1>
                    <p className="text-gray-400 leading-relaxed">
                      Your restaurant AI agent is now ready to handle calls.
                      Redirecting you to the dashboard...
                    </p>

                    <div className="flex justify-center pt-4">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500/30 border-t-emerald-500"></div>
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <MinimalHeader />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative z-10"
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
