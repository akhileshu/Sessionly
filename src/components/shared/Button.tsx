import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { Icon, type IconName } from "./icons";

const buttonVariants = cva(
  "rounded-md text-sm font-medium transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
        ghost: "text-gray-700 hover:bg-gray-100",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: IconName;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className, {
        "inline-flex align-middle items-center": props.icon,
      })}
      {...props}
    >
      {props.icon ? (
        <Icon withTooltip={false} className="mr-1" name={props.icon} />
      ) : null}
      {children}
    </button>
  )
);
Button.displayName = "Button";
