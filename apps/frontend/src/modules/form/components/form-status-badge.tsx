import type { FormListType } from "%/form/types.ts";
import { Badge } from "@/components/ui/badge.tsx";

interface FormStatusBadgeProps {
  status: FormListType["status"];
}

export function FormStatusBadge({ status }: FormStatusBadgeProps) {
  switch (status) {
    case "draft":
      return (
        <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">Wersja robocza</Badge>
      );
    case "published":
      return <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Aktywna</Badge>;
    case "closed":
      return <Badge variant="destructive">Nieaktywna</Badge>;
    case "archived":
      return (
        <Badge variant="ghost" className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          Zarchiwizowana
        </Badge>
      );
  }
}
