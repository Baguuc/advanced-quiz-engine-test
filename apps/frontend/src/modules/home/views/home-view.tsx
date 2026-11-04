import { getRouteApi } from "@tanstack/react-router";
import { FormCard } from "%/home/components/form-card.tsx";

export function HomeView() {
  const routeApi = getRouteApi("/(authenticated)/");
  const forms = routeApi.useLoaderData();

  if (forms.length === 0) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg text-muted-foreground">Nie masz jeszcze żadnych ankiet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-stretch gap-6 justify-between">
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </div>
  );
}
