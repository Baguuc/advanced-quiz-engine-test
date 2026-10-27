import { client } from "@/lib/client";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { safe } from "@orpc/client";
import { FormDetailsView } from "%/form-details/views/form-details-view.tsx";

export const Route = createFileRoute("/(authenticated)/form_/$formId/details")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const [error, data, definedError] = await safe(client.form.getDetails({ formId: Number(params.formId) }));

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
  return <FormDetailsView />;
}
