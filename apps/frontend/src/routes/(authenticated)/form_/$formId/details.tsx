import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { orpc } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/form_/$formId/details")({
  component: RouteComponent,
});

function RouteComponent() {
  const { formId } = Route.useParams();
  const formQuery = useQuery(orpc.form.getDetails.queryOptions({ input: { formId: Number(formId) } }));

  if (formQuery.isPending) {
    return <main className="p-6">Ładowanie ankiety...</main>;
  }

  if (formQuery.isError) {
    return <main className="p-6">Nie udało się pobrać szczegółów ankiety.</main>;
  }

  const form = formQuery.data;
  const completionRate =
    form.responseStats.total === 0 ? 0 : Math.round((form.responseStats.completed / form.responseStats.total) * 100);

  return (
    <main className="min-h-[calc(100vh-65px)] bg-muted px-5 py-6 sm:px-8 lg:px-14 lg:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>{form.title}</CardTitle>
              <Badge>{form.status}</Badge>
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
      </div>
    </main>
  );
}
