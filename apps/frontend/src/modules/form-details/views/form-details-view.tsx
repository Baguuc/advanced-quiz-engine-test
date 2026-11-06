import { getRouteApi } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormStatusBadge } from "%/form/components/form-status-badge.tsx";
import { Button } from "@/components/ui/button";
import { orpc } from "@/lib/client.ts";
import { toast } from "@/components/ui/toast.tsx";
import { Archive, Power, PowerOff } from "lucide-react";

export function FormDetailsView() {
  const routeApi = getRouteApi("/(authenticated)/form_/$formId/details");
  const form = routeApi.useLoaderData();
  const router = useRouter();

  const updateStatusMutation = useMutation(
    orpc.form.updateStatus.mutationOptions({
      onSuccess: async () => {
        await router.invalidate();
        toast.add({ type: "success", description: "Status formularza został zmieniony" });
      },
      onError: () => {
        toast.add({ type: "error", description: "Nie udało się zmienić statusu formularza" });
      },
    }),
  );

  const completionRate =
    form.responseStats.total === 0 ? 0 : Math.round((form.responseStats.completed / form.responseStats.total) * 100);

  const updateStatus = (status: "published" | "closed" | "archived") => {
    updateStatusMutation.mutate({ formId: form.id, status });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>{form.title}</CardTitle>
            <FormStatusBadge status={form.status} />
          </div>
          <CardDescription>{form.description ?? "Brak opisu ankiety."}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <p>Widoczność: {form.visibility}</p>
          <p>Anonimowe odpowiedzi: {form.allowAnonymous ? "Tak" : "Nie"}</p>
          <p>Wiele odpowiedzi: {form.allowMultipleResponses ? "Tak" : "Nie"}</p>
          <p>Liczba pytań: {form.questions.length}</p>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Pytania</h2>
        {form.questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-base">
                {question.position}. {question.title}
              </CardTitle>
              <CardDescription>
                {question.description ?? "Brak opisu"} | Typ: {question.type} |{" "}
                {question.required ? "Wymagane" : "Opcjonalne"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">
              Liczba odpowiedzi:{" "}
              {form.questionResponseStats.find((stats) => stats.questionId === question.id)?.answered ?? 0}
            </CardContent>
            {question.options.length > 0 && (
              <CardContent>
                <div className="space-y-3">
                  {question.options.map((option) => {
                    const optionStats = form.questionResponseStats
                      .find((stats) => stats.questionId === question.id)
                      ?.options.find((stats) => stats.optionId === option.id);
                    const percentage = optionStats?.percentage ?? 0;

                    return (
                      <div key={option.id} className="space-y-1">
                        <div className="flex justify-between gap-4 text-sm">
                          <span>{option.label}</span>
                          <span className="font-medium">
                            {percentage}% ({optionStats?.count ?? 0})
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Statystyki odpowiedzi</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Wszystkie odpowiedzi</CardDescription>
              <CardTitle>{form.responseStats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Ukończone odpowiedzi</CardDescription>
              <CardTitle>{form.responseStats.completed}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Wskaźnik ukończenia</CardDescription>
              <CardTitle>{completionRate}%</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Zmiana statusu</h2>
        <div className="flex w-full flex-wrap gap-3">
          <Button
            variant="destructive"
            className="min-w-40 flex-1 gap-2"
            disabled={updateStatusMutation.isPending}
            onClick={() => updateStatus("closed")}
          >
            <PowerOff aria-hidden="true" />
            Dezaktywuj
          </Button>
          <Button
            className="min-w-40 flex-1 gap-2 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            disabled={updateStatusMutation.isPending}
            onClick={() => updateStatus("published")}
          >
            <Power aria-hidden="true" />
            Aktywuj
          </Button>
          <Button
            variant="outline"
            className="min-w-40 flex-1 gap-2"
            disabled={updateStatusMutation.isPending}
            onClick={() => updateStatus("archived")}
          >
            <Archive aria-hidden="true" />
            Archiwizuj
          </Button>
        </div>
      </section>
    </div>
  );
}
