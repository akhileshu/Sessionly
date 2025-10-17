import { cn } from "@/lib/utils";
import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: "sm" | "md" | "lg";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses =
      size === "sm"
        ? "px-2 py-1 text-sm"
        : size === "lg"
        ? "px-4 py-3 text-base"
        : "px-3 py-2 text-sm";

    return (
      <input
        ref={ref}
        className={cn(
          "border rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          sizeClasses,
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
