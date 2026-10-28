import type { FormListType } from "%/form/types.ts";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "@tanstack/react-router";
import { FormStatusBadge } from "%/form/components/form-status-badge.tsx";

interface FormCardProps {
  form: FormListType;
}

export function FormCard({ form }: FormCardProps) {
  return (
    <Card className="relative flex w-full max-w-sm flex-col pt-0">
      <img
        src="https://bi.im-g.pl/im/e6/13/1c/z29441766AMP,Ulica-Gospodarcza-w-Sosnowcu-konczy-sie-obecnie-mu.jpg"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-100"
      />
      <CardHeader>
        <CardAction>
          <FormStatusBadge status={form.status} />
        </CardAction>
        <CardTitle>{form.title}</CardTitle>
        <CardDescription className="col-span-2 line-clamp-3">{form.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Link className="w-full" to={"/form/$formId/details"} params={{ formId: form.id.toString() }}>
          <Button className="w-full">Zobacz szczegóły ankiety</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
