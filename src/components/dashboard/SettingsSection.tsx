import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Restaurant } from "@/types/global";
import { LANGUAGE_OPTIONS } from "@/lib/constants";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useRestaurantStorage } from "@/hooks/useRestaurantStorage";

export interface SettingsSectionProps {
  tabId: "settings";
}

const SettingsSection: React.FC<SettingsSectionProps> = () => {
  const router = useRouter();
  const {
    restaurantId,
    restaurantData,
    loading,
    saveRestaurantData,
    deleteAllData,
  } = useRestaurantStorage();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setSaveLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const hasInitialized = useRef(false);

  // Initialize local state with current restaurant data
  useEffect(() => {
    if (restaurantData && !hasInitialized.current) {
      setRestaurant(restaurantData);
      hasInitialized.current = true;
    }
  }, [restaurantData]);

  const handleInputChange = (
    field: keyof Restaurant,
    value: string | Restaurant["menuDetails"]
  ) => {
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
      await saveRestaurantData({
        name: restaurant.name,
        agentName: restaurant.agentName,
        menuDetails: restaurant.menuDetails,
        specialInstructions: restaurant.specialInstructions,
        languagePreference: restaurant.languagePreference,
      });

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteAllData();
      if (success) {
        // Redirect to home page after successful deletion
        router.push("/client");
      } else {
        setSaveMessage({
          type: "error",
          text: "Failed to delete restaurant data. Please try again.",
        });
      }
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "Failed to delete restaurant data. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">Loading restaurant settings...</div>
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

  // Helper function to render menu details as readable options
  const renderMenuDetails = (menuDetails: Restaurant["menuDetails"]) => {
    if (typeof menuDetails === "string") {
      return menuDetails;
    }

    if (Array.isArray(menuDetails)) {
      return menuDetails
        .map((item, index) => {
          if (typeof item === "string") {
            return `${index + 1}. ${item}`;
          }
          if (typeof item === "object" && item !== null) {
            const name = item.name || "Menu Item";
            const price = item.price ? ` - $${item.price}` : "";
            const description = item.description
              ? ` (${item.description})`
              : "";
            return `${index + 1}. ${name}${price}${description}`;
          }
          return `${index + 1}. ${String(item)}`;
        })
        .join("\n");
    }

    if (typeof menuDetails === "object" && menuDetails !== null) {
      return Object.entries(menuDetails)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}:\n${value.map((item, i) => `  ${i + 1}. ${typeof item === "object" ? item.name || String(item) : String(item)}`).join("\n")}`;
          }
          return `${key}: ${String(value)}`;
        })
        .join("\n\n");
    }

    return String(menuDetails);
  };

  const handleMenuDetailsChange = (value: string) => {
    // Try to parse as structured data, fallback to string
    try {
      // If it looks like JSON, parse it
      if (value.trim().startsWith("{") || value.trim().startsWith("[")) {
        handleInputChange("menuDetails", JSON.parse(value));
      } else {
        // Otherwise, treat as plain text
        handleInputChange("menuDetails", value);
      }
    } catch (e) {
      // If parsing fails, store as string
      handleInputChange("menuDetails", value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Restaurant Information Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
              label="Restaurant ID"
              value={restaurantId || "Not available"}
              disabled
              helperText="Customers need this ID when calling your AI agent"
            />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="AI Agent Phone Number"
              value={process.env.NEXT_PUBLIC_VIRTUAL_NUMBER || "Not configured"}
              disabled
              helperText="Customers call this number and provide your Restaurant ID"
            />
          </div>
        </div>
      </div>

      {/* AI Agent Configuration Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                <span className="text-red-500 ml-1" aria-label="required">
                  *
                </span>
              </label>
              <select
                value={restaurant.languagePreference}
                onChange={(e) =>
                  handleInputChange("languagePreference", e.target.value)
                }
                className="input"
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
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            </label>
            <div className="min-h-96 max-h-96 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-50">
              {Array.isArray(restaurant.menuDetails) &&
              restaurant.menuDetails.length > 0 ? (
                <div className="space-y-3">
                  {restaurant.menuDetails.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {typeof item === "object" && item !== null
                              ? item.name
                              : String(item)}
                          </h4>
                          {typeof item === "object" &&
                            item !== null &&
                            item.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {item.description}
                              </p>
                            )}
                        </div>
                        <div className="ml-4 text-right">
                          <span className="text-lg font-semibold text-green-600">
                            {typeof item === "object" && item !== null
                              ? item.price
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">No menu items available</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Menu items will appear here once you complete the onboarding
                    process
                  </p>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Your menu items are displayed here. To update them, you can
              re-upload your menu through the onboarding process.
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
              className="input resize-none"
            />
            <p className="mt-2 text-sm text-gray-500">
              Include any specific guidelines, policies, or procedures the AI
              agent should follow.
            </p>
          </div>
        </div>
      </div>

      {/* Customer Instructions */}
      <div className="bg-amber-50 rounded-lg shadow-sm border border-amber-200">
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-amber-900 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
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
            Instructions for Your Customers
          </h3>
          <div className="text-sm text-amber-800 space-y-2">
            <p className="font-medium">Tell your customers to:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>
                Call{" "}
                <span className="font-mono font-bold">
                  {process.env.NEXT_PUBLIC_VIRTUAL_NUMBER || "(555) 123-4567"}
                </span>
              </li>
              <li>
                When prompted, provide Restaurant ID:{" "}
                <span className="font-mono font-bold bg-amber-100 px-1 rounded">
                  {restaurantId}
                </span>
              </li>
              <li>Place their order with the AI agent</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Save Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200">
        <div className="px-6 py-4 border-b border-red-200">
          <h2 className="text-lg font-medium text-red-900">Danger Zone</h2>
          <p className="text-sm text-red-600 mt-1">
            Permanently delete your restaurant data and reset the system.
          </p>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Delete Restaurant Data
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                This will permanently delete all your restaurant data, calls,
                and orders. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
            >
              Delete All Data
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Restaurant Data"
        message={`Are you sure you want to delete all data for restaurant ID "${restaurantId}"? This will permanently delete your restaurant information, all calls, and orders. This action cannot be undone.`}
        confirmText="Delete Everything"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
};

export default SettingsSection;
