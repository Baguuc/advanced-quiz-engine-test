import { Form } from "lucide-react";
import { cn } from "cn";

interface CompanyLogoProps {
  large?: boolean;
}

export function CompanyLogo({ large = false }: CompanyLogoProps) {
  return (
    <div className="flex items-center gap-2 self-center font-medium">
      <div
        className={cn(
          "flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground",
          large && "size-10",
        )}
      >
        <Form className={cn("size-4", large && "size-8")} />
      </div>
      <p className={cn(large && "text-xl")}>Advanced Quiz Engine</p>
    </div>
  );
}
