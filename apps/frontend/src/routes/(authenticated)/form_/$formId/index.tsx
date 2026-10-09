import { createFileRoute, notFound } from "@tanstack/react-router";
import { client } from "@/lib/client.ts";
import { safe } from "@orpc/client";
import { SurveyPage } from "@/components/form/survey-page.tsx";

export const Route = createFileRoute("/(authenticated)/form_/$formId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const id = Number(params.formId);
    if (Number.isNaN(id)) {
      throw notFound();
    }

    const [error, data, definedError] = await safe(client.form.get({ formId: id }));

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

  return <SurveyPage form={data} />;
}
