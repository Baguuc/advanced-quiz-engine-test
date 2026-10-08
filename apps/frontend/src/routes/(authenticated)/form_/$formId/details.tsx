import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/form_/$formId/details")({
  component: RouteComponent,
});

function RouteComponent() {
  const { formId } = Route.useParams();

  return <div>Hello "/(authenticated)/form_/$formId/details"!</div>;
}
