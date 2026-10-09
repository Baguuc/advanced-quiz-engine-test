import * as React from "react";

interface FormCardProps {
  children: React.ReactNode;
}

export function FormCard({ children }: FormCardProps) {
  return (
    <div className="bg-gray-200 dark:bg-neutral-900 p-4 rounded-lg border-2 border-gray-300 dark:border-neutral-700">
      {children}
    </div>
  );
}
