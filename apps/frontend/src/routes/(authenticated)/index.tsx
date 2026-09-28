import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardAction, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";

const surveys = [
  {
    title: "Ankieta 1",
    description: "Opis ankiety 1",
    isActive: true,
    imageSrc: "https://bi.im-g.pl/im/e6/13/1c/z29441766AMP,Ulica-Gospodarcza-w-Sosnowcu-konczy-sie-obecnie-mu.jpg",
  },
  {
    title: "Ankieta 2",
    description: "Opis ankiety 2",
    isActive: true,
    imageSrc: "https://bi.im-g.pl/im/e6/13/1c/z29441766AMP,Ulica-Gospodarcza-w-Sosnowcu-konczy-sie-obecnie-mu.jpg",
  },
  {
    title: "Ankieta 3",
    description: "Opis ankiety 3",
    isActive: false,
    imageSrc: "https://bi.im-g.pl/im/e6/13/1c/z29441766AMP,Ulica-Gospodarcza-w-Sosnowcu-konczy-sie-obecnie-mu.jpg",
  },
];

export const Route = createFileRoute("/(authenticated)/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-[calc(100vh-65px)] bg-white px-5 py-6 text-slate-950 sm:px-8 lg:px-14 lg:py-10">
      <div className="flex flex-wrap items-stretch gap-6 justify-between">
        <Card
          className="relative flex w-full max-w-sm flex-col pt-0"
          onClick={() => {
            alert("kutas");
          }}
        >
          <img
            src="data:image/jpeg;base64,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"
            alt="Event cover"
            className="relative z-20 aspect-video h-full w-full object-cover brightness-60 grayscale dark:brightness-40"
          />

          <CardFooter className="mt-auto">
            <CardTitle>Utwórz ankiete</CardTitle>
          </CardFooter>
        </Card>

        {surveys.map((x) => (
          <Card key={x.title} className="relative flex w-full max-w-sm flex-col pt-0">
            <img
              src={x.imageSrc}
              alt="Event cover"
              className="relative z-20 aspect-video w-full object-cover brightness-100"
            />
            <CardHeader>
              <CardAction>
                {x.isActive ? (
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">Active</Badge>
                ) : (
                  <Badge variant="destructive">Inactive</Badge>
                )}
              </CardAction>
              <CardTitle>{x.title}</CardTitle>
              <CardDescription>{x.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button className="w-full">zobacz szczegóły ankiety</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
