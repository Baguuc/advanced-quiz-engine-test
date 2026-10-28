import { getRouteApi } from "@tanstack/react-router";
import { FormCard } from "%/home/components/form-card.tsx";

export function HomeView() {
  const routeApi = getRouteApi("/(authenticated)/");
  const forms = routeApi.useLoaderData();

  return (
    <div className="flex flex-wrap items-stretch gap-6 justify-between">
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </div>
  );
}
