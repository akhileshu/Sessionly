import React from "react";

type PillProps = React.ComponentProps<"span">;

export function Pill({ children, className = "", ...props }: PillProps) {
  return (
    <span
      className={`px-2 py-0.5 text-sm font-semibold text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/40 rounded-full ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
