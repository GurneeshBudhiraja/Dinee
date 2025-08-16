import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "neutral";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = "default", size = "md", children, ...props },
    ref
  ) => {
    const baseStyles = "inline-flex items-center font-medium rounded-full";

    const variants = {
      default: "bg-primary-50 text-primary-700 border border-primary-200",
      success: "bg-success-50 text-green-700 border border-green-200",
      warning: "bg-warning-50 text-yellow-700 border border-yellow-200",
      error: "bg-error-50 text-red-700 border border-red-200",
      info: "bg-blue-50 text-blue-700 border border-blue-200",
      neutral: "bg-gray-100 text-gray-700 border border-gray-200",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-xs",
      lg: "px-3 py-1 text-sm",
    };

    return (
      <span
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
