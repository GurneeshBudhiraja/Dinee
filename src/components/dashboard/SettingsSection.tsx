import React, { useState, useEffect } from "react";
import { Restaurant } from "@/types/global";
import { LANGUAGE_OPTIONS } from "@/lib/constants";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRestaurant } from "@/contexts";

export interface SettingsSectionProps {
  tabId: "settings";
}

const SettingsSection: React.FC<SettingsSectionProps> = () => {
  const {
    state: { currentRestaurant, loading, error },
    actions,
  } = useRestaurant();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Initialize local state with current restaurant data
  useEffect(() => {
    if (currentRestaurant) {
      setRestaurant(currentRestaurant);
    }
  }, [currentRestaurant]);

  const handleInputChange = (field: keyof Restaurant, value: string) => {
    if (restaurant) {
      setRestaurant((prev) =>
        prev
          ? {
              ...prev,
              [field]: value,
            }
          : null
      );
      // Clear save message when user starts editing
      if (saveMessage) {
        setSaveMessage(null);
      }
    }
  };

  const handleSave = async () => {
    if (!restaurant) return;

    setSaveLoading(true);
    setSaveMessage(null);

    try {
      // Update the restaurant in the context
      actions.updateRestaurant(restaurant);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSaveMessage({
        type: "success",
        text: "Settings saved successfully!",
      });
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "Failed to save settings. Please try again.",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">Loading restaurant settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error loading settings: {error}</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">No restaurant data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Restaurant Information Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Restaurant Information
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update your restaurant&apos;s basic information.
          </p>
        </div>
        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Restaurant Name"
              value={restaurant.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter restaurant name"
              required
            />
            <Input
              label="Virtual Phone Number"
              value={restaurant.virtualNumber || ""}
              disabled
              helperText="This number was generated during setup and cannot be changed"
            />
          </div>
        </div>
      </div>

      {/* AI Agent Configuration Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            AI Agent Configuration
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure your AI agent&apos;s behavior and responses.
          </p>
        </div>
        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Agent Name"
              value={restaurant.agentName}
              onChange={(e) => handleInputChange("agentName", e.target.value)}
              placeholder="Enter agent name"
              required
              helperText="This is how your AI agent will introduce itself to customers"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language Preference
                <span className="text-error-500 ml-1" aria-label="required">
                  *
                </span>
              </label>
              <select
                value={restaurant.languagePreference}
                onChange={(e) =>
                  handleInputChange("languagePreference", e.target.value)
                }
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menu Details
              <span className="text-error-500 ml-1" aria-label="required">
                *
              </span>
            </label>
            <textarea
              value={restaurant.menuDetails}
              onChange={(e) => handleInputChange("menuDetails", e.target.value)}
              placeholder="Describe your menu items, specialties, and offerings..."
              rows={4}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Provide details about your menu to help the AI agent answer
              customer questions accurately.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              value={restaurant.specialInstructions}
              onChange={(e) =>
                handleInputChange("specialInstructions", e.target.value)
              }
              placeholder="Any special instructions for the AI agent when handling calls..."
              rows={4}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <p className="mt-2 text-sm text-gray-500">
              Include any specific guidelines, policies, or procedures the AI
              agent should follow.
            </p>
          </div>
        </div>
      </div>

      {/* Save Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Save Changes
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Make sure to save your changes before leaving this page.
              </p>
            </div>
            <Button
              onClick={handleSave}
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>

          {saveMessage && (
            <div
              className={`mt-4 p-3 rounded-md ${
                saveMessage.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 ${
                    saveMessage.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {saveMessage.type === "success" ? (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      saveMessage.type === "success"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {saveMessage.text}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
