import { createFileRoute, notFound } from "@tanstack/react-router";
import { client } from "@/lib/client.ts";
import { safe } from "@orpc/client";
import { FormCard } from "@/components/form/form-card.tsx";
import { Button } from "@/components/ui/button.tsx";

export const Route = createFileRoute("/(authenticated)/form_/$formId/completed")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const id = Number(params.formId);
    if (Number.isNaN(id)) {
      throw notFound();
    }

    const [error, data, definedError] = await safe(client.response.queryCompletionScreen({ formId: id }));

    if (definedError) {
      throw notFound();
    } else if (error) {
      console.error(error);
      throw error;
    } else {
      return data;
    }
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return (
    <FormCard className="grid gap-2">
      <h1 className="font-bold text-5xl mb-10">{data.title}</h1>

      <p>Twoja odpowiedź została zapisana.</p>

      <Button className="w-min">Wyślij kopie mailem</Button>
    </FormCard>
  );
}
