import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex flex-wrap items-stretch gap-6 justify-between">
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
  );
}
