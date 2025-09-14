import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CustomRadioProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
  variant = "default",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return "p-3";
      case "detailed":
        return "p-5";
      default:
        return "p-4";
    }
  };

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center cursor-pointer rounded-lg transition-all duration-200",
        "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
        "focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:ring-offset-2 focus-within:ring-offset-black",
        checked &&
          "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/40",
        disabled && "opacity-50 cursor-not-allowed",
        getVariantStyles(),
        className
      )}
    >
      {/* Custom Radio Button */}
      <div className="relative flex-shrink-0 mr-4">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            "rounded-full border-2 transition-all duration-200 flex items-center justify-center",
            variant === "compact" ? "w-4 h-4" : "w-5 h-5",
            checked
              ? "border-emerald-500 bg-emerald-500"
              : "border-white/30 bg-transparent hover:border-white/50"
          )}
        >
          {checked && (
            <Check
              className={cn(
                "text-white",
                variant === "compact" ? "w-2.5 h-2.5" : "w-3 h-3"
              )}
              strokeWidth={3}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            "font-medium transition-colors duration-200",
            variant === "compact" ? "text-sm" : "text-sm",
            checked ? "text-emerald-400" : "text-white"
          )}
        >
          {label}
        </span>
        {description && variant === "detailed" && (
          <p className="text-xs text-white/60 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Selection Indicator */}
      {checked && (
        <div className="ml-auto flex-shrink-0">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        </div>
      )}
    </label>
  );
};

export default CustomRadio;
