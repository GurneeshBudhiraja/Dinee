import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && (
              <span className="text-error-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div
                className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                aria-hidden="true"
              >
                {leftIcon}
              </div>
            </div>
          )}

          <input
            type={type}
            id={inputId}
            className={cn(
              "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-transparent transition-colors duration-200",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "sm:h-11 sm:px-4 sm:text-base",
              leftIcon && "pl-9 sm:pl-10",
              rightIcon && "pr-9 sm:pr-10",
              hasError
                ? "border-error-500 focus:ring-error-500"
                : "border-gray-300 focus:ring-primary-500",
              className
            )}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div
                className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                aria-hidden="true"
              >
                {rightIcon}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-error-500"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
