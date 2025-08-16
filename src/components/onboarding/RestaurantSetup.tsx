"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Restaurant, LanguagePreference } from "@/types/global";

interface RestaurantSetupProps {
  onComplete: (
    restaurantData: Omit<Restaurant, "id" | "virtualNumber">
  ) => Promise<void>;
  loading?: boolean;
}

interface FormData {
  name: string;
  agentName: string;
  menuDetails: string;
  specialInstructions: string;
  languagePreference: LanguagePreference;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const STEPS = [
  {
    id: "restaurant-name",
    title: "Restaurant Information",
    description: "Tell us about your restaurant",
  },
  {
    id: "agent-name",
    title: "AI Agent Setup",
    description: "Configure your AI agent",
  },
  {
    id: "menu-details",
    title: "Menu Details",
    description: "Provide your menu information",
  },
  {
    id: "special-instructions",
    title: "Special Instructions",
    description: "Add any special handling instructions",
  },
  {
    id: "language-preferences",
    title: "Language Preferences",
    description: "Choose your preferred language",
  },
];

const LANGUAGE_OPTIONS: { value: LanguagePreference; label: string }[] = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
];

const RestaurantSetup: React.FC<RestaurantSetupProps> = ({
  onComplete,
  loading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    agentName: "",
    menuDetails: "",
    specialInstructions: "",
    languagePreference: "english",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};
    const currentStepId = STEPS[currentStep].id;

    switch (currentStepId) {
      case "restaurant-name":
        if (!formData.name.trim()) {
          newErrors.name = "Restaurant name is required";
        } else if (formData.name.trim().length < 2) {
          newErrors.name = "Restaurant name must be at least 2 characters";
        }
        break;

      case "agent-name":
        if (!formData.agentName.trim()) {
          newErrors.agentName = "Agent name is required";
        } else if (formData.agentName.trim().length < 2) {
          newErrors.agentName = "Agent name must be at least 2 characters";
        }
        break;

      case "menu-details":
        if (!formData.menuDetails.trim()) {
          newErrors.menuDetails = "Menu details are required";
        } else if (formData.menuDetails.trim().length < 10) {
          newErrors.menuDetails =
            "Please provide more detailed menu information (at least 10 characters)";
        }
        break;

      case "special-instructions":
        // Special instructions are optional, but if provided should be meaningful
        if (
          formData.specialInstructions.trim() &&
          formData.specialInstructions.trim().length < 5
        ) {
          newErrors.specialInstructions =
            "Special instructions should be at least 5 characters if provided";
        }
        break;

      case "language-preferences":
        if (!formData.languagePreference) {
          newErrors.languagePreference = "Please select a language preference";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Setup failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    const currentStepId = STEPS[currentStep].id;

    switch (currentStepId) {
      case "restaurant-name":
        return (
          <Input
            label="Restaurant Name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("name", e.target.value)
            }
            error={errors.name}
            placeholder="Enter your restaurant name"
            required
            autoFocus
            disabled={isSubmitting || loading}
          />
        );

      case "agent-name":
        return (
          <Input
            label="AI Agent Name"
            value={formData.agentName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("agentName", e.target.value)
            }
            error={errors.agentName}
            placeholder="Enter a name for your AI agent"
            helperText="This is how your AI agent will introduce itself to customers"
            required
            autoFocus
            disabled={isSubmitting || loading}
          />
        );

      case "menu-details":
        return (
          <div>
            <label
              htmlFor="menu-details"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Menu Details
              <span className="text-error-500 ml-1" aria-label="required">
                *
              </span>
            </label>
            <textarea
              id="menu-details"
              value={formData.menuDetails}
              onChange={(e) => handleInputChange("menuDetails", e.target.value)}
              placeholder="Describe your menu items, prices, and categories..."
              className={`w-full h-32 px-3 py-2 border rounded-md text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-transparent resize-none ${
                errors.menuDetails
                  ? "border-error-500 focus:ring-error-500"
                  : "border-gray-300 focus:ring-primary-500"
              }`}
              required
              autoFocus
              disabled={isSubmitting || loading}
              aria-invalid={Boolean(errors.menuDetails)}
              aria-describedby={
                errors.menuDetails
                  ? "menu-details-error"
                  : "menu-details-helper"
              }
            />
            {errors.menuDetails && (
              <p
                id="menu-details-error"
                className="mt-2 text-sm text-error-500"
                role="alert"
              >
                {errors.menuDetails}
              </p>
            )}
            {!errors.menuDetails && (
              <p
                id="menu-details-helper"
                className="mt-2 text-sm text-gray-500"
              >
                Include popular items, prices, and any special categories or
                dietary options
              </p>
            )}
          </div>
        );

      case "special-instructions":
        return (
          <div>
            <label
              htmlFor="special-instructions"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Special Instructions
              <span className="text-gray-500 ml-1">(Optional)</span>
            </label>
            <textarea
              id="special-instructions"
              value={formData.specialInstructions}
              onChange={(e) =>
                handleInputChange("specialInstructions", e.target.value)
              }
              placeholder="Any special handling instructions for your AI agent..."
              className={`w-full h-32 px-3 py-2 border rounded-md text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-transparent resize-none ${
                errors.specialInstructions
                  ? "border-error-500 focus:ring-error-500"
                  : "border-gray-300 focus:ring-primary-500"
              }`}
              autoFocus
              disabled={isSubmitting || loading}
              aria-invalid={Boolean(errors.specialInstructions)}
              aria-describedby={
                errors.specialInstructions
                  ? "special-instructions-error"
                  : "special-instructions-helper"
              }
            />
            {errors.specialInstructions && (
              <p
                id="special-instructions-error"
                className="mt-2 text-sm text-error-500"
                role="alert"
              >
                {errors.specialInstructions}
              </p>
            )}
            {!errors.specialInstructions && (
              <p
                id="special-instructions-helper"
                className="mt-2 text-sm text-gray-500"
              >
                Examples: &quot;Always ask for pickup time&quot;, &quot;Mention
                daily specials&quot;, &quot;Check for allergies&quot;
              </p>
            )}
          </div>
        );

      case "language-preferences":
        return (
          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-4">
                Language Preference
                <span className="text-error-500 ml-1" aria-label="required">
                  *
                </span>
              </legend>
              <div className="space-y-3">
                {LANGUAGE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="languagePreference"
                      value={option.value}
                      checked={formData.languagePreference === option.value}
                      onChange={(e) =>
                        handleInputChange(
                          "languagePreference",
                          e.target.value as LanguagePreference
                        )
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      disabled={isSubmitting || loading}
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {errors.languagePreference && (
              <p className="mt-2 text-sm text-error-500" role="alert">
                {errors.languagePreference}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Setup</h1>
          <p className="mt-2 text-sm text-gray-600">
            Let&apos;s configure your AI agent for your restaurant
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {STEPS[currentStep].title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {STEPS[currentStep].description}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {errors.general && (
              <div
                className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-6"
                role="alert"
                aria-live="polite"
              >
                {errors.general}
              </div>
            )}

            <div className="space-y-6">{renderStepContent()}</div>

            <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isSubmitting || loading}
              >
                Previous
              </Button>

              {isLastStep ? (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting || loading}
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? "Setting up..." : "Complete Setup"}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={isSubmitting || loading}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantSetup;
