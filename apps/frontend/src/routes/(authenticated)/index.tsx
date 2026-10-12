import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/client";

export const Route = createFileRoute("/(authenticated)/")({
  component: Index,
});

function Index() {
  const forms = useQuery(orpc.form.list.queryOptions());

  return (
    <div className="flex flex-wrap items-stretch gap-6 justify-between">
      {forms.data?.map((x) => (
        <Card key={x.id} className="relative flex w-full max-w-sm flex-col pt-0">
          <img
            src="https://bi.im-g.pl/im/e6/13/1c/z29441766AMP,Ulica-Gospodarcza-w-Sosnowcu-konczy-sie-obecnie-mu.jpg"
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover brightness-100"
          />
          <CardHeader>
            <CardAction>
              {x.status === "draft" ? (
                <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                  Wersja robocza
                </Badge>
              ) : x.status === "published" ? (
                <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Aktywna</Badge>
              ) : x.status === "closed" ? (
                <Badge variant="destructive">Nieaktywna</Badge>
              ) : x.status === "archived" ? (
                <Badge variant="ghost" className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  Zarchiwizowana
                </Badge>
              ) : null}
            </CardAction>
            <CardTitle>{x.title}</CardTitle>
            <CardDescription>{x.description}</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button
              className="w-full"
              render={<Link to={"/form/$formId/details"} params={{ formId: x.id.toString() }} />}
            >
              Zobacz szczegóły ankiety
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
