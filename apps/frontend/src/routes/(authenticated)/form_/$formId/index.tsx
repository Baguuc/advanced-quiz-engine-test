import { createFileRoute, notFound } from "@tanstack/react-router";
import { client } from "@/lib/client.ts";
import { safe } from "@orpc/client";
import { router } from "@/main.tsx";
import { FormSurveyView } from "%/form/views/form-survey-view.tsx";

export const Route = createFileRoute("/(authenticated)/form_/$formId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const id = Number(params.formId);
    if (Number.isNaN(id)) {
      throw notFound();
    }

    const [error, data, definedError] = await safe(client.form.get({ formId: id }));

    if (definedError) {
      if (definedError.code === "BAD_REQUEST") {
        await router.navigate({ to: "/form/$formId/completed", params: { formId: params.formId } });
        throw Error();
      } else {
        throw notFound();
      }
    } else if (error) {
      console.error(error);
      throw error;
    } else {
      return data;
    }
  },
});

function RouteComponent() {
  return <FormSurveyView />;
}
