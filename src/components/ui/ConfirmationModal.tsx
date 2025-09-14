import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const prevIsOpen = useRef(isOpen);

  useEffect(() => {
    if (!isOpen && prevIsOpen.current) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsClosing(false);
        // Actual close is handled by parent, this just manages animation state
      }, 300); // Animation duration
      return () => clearTimeout(timer);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const variantStyles = {
    danger: {
      icon: (
        <svg
          className="w-6 h-6 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
      bgColor: "bg-red-500/10 border border-red-500/20",
      buttonVariant: "destructive" as const,
    },
    warning: {
      icon: (
        <svg
          className="w-6 h-6 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
      bgColor: "bg-yellow-500/10 border border-yellow-500/20",
      buttonVariant: "primary" as const,
    },
    info: {
      icon: (
        <svg
          className="w-6 h-6 text-emerald-400"
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
      ),
      bgColor: "bg-emerald-500/10 border border-emerald-500/20",
      buttonVariant: "primary" as const,
    },
  };

  const currentVariant = variantStyles[variant];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div
          className={cn(
            "inline-block align-bottom bg-black border border-white/20 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full",
            "duration-300",
            isOpen ? "sm:scale-100 opacity-100" : "sm:scale-95 opacity-0"
          )}
        >
          <div className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div
                className={cn(
                  "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10",
                  currentVariant.bgColor
                )}
              >
                {currentVariant.icon}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-white">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-white/70">{message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-black border-t border-white/10 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              variant={currentVariant.buttonVariant}
              onClick={onConfirm}
              loading={loading}
              disabled={loading}
              className="w-full sm:ml-3 sm:w-auto"
            >
              {confirmText}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
