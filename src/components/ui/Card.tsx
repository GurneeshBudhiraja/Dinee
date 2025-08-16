import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  expandable?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children: React.ReactNode;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  expandable?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      expandable = false,
      expanded: controlledExpanded,
      onExpandedChange,
      children,
      ...props
    },
    ref
  ) => {
    const [internalExpanded, setInternalExpanded] = useState(false);

    const isExpanded =
      controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

    const handleExpandedChange = (newExpanded: boolean) => {
      if (controlledExpanded === undefined) {
        setInternalExpanded(newExpanded);
      }
      onExpandedChange?.(newExpanded);
    };

    return (
      <div
        className={cn(
          "rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md",
          className
        )}
        ref={ref}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === CardHeader) {
              return React.cloneElement(
                child as React.ReactElement<CardHeaderProps>,
                {
                  expandable,
                  expanded: isExpanded,
                  onToggle: () => handleExpandedChange(!isExpanded),
                }
              );
            }
            if (child.type === CardContent && expandable) {
              return (
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200 ease-in-out",
                    isExpanded ? "max-h-none opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  {child}
                </div>
              );
            }
          }
          return child;
        })}
      </div>
    );
  }
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      className,
      children,
      expandable = false,
      expanded = false,
      onToggle,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200",
          expandable &&
            "cursor-pointer hover:bg-gray-50 focus:bg-gray-50 transition-colors duration-200",
          className
        )}
        ref={ref}
        onClick={expandable ? onToggle : undefined}
        role={expandable ? "button" : undefined}
        tabIndex={expandable ? 0 : undefined}
        onKeyDown={
          expandable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggle?.();
                }
              }
            : undefined
        }
        aria-expanded={expandable ? expanded : undefined}
        aria-label={
          expandable
            ? `${expanded ? "Collapse" : "Expand"} card details`
            : undefined
        }
        {...props}
      >
        <div className="flex-1 min-w-0">{children}</div>
        {expandable && (
          <div className="flex-shrink-0 ml-2">
            <svg
              className={cn(
                "h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform duration-200",
                expanded && "rotate-180"
              )}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("px-4 py-3 sm:px-6 sm:py-4", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200 bg-gray-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
