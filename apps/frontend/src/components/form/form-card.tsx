import * as React from "react";
import { cn } from "cn";

interface FormCardProps {
  children: React.ReactNode;
  className?: string;
}

export function FormCard({ children, className }: FormCardProps) {
  return (
    <div
      className={cn(
        "bg-gray-200 dark:bg-neutral-900 p-4 rounded-lg border-2 border-gray-300 dark:border-neutral-700",
        className,
      )}
    >
      {children}
    </div>
  );
}
