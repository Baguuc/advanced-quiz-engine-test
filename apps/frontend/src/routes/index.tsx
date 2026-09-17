import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { orpc } from "@/lib/client.ts";
import { queryClient } from "@/main.tsx";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const query = useQuery(orpc.planet.list.queryOptions());

  const mutation = useMutation(
    orpc.planet.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: orpc.planet.key() });
      },
    }),
  );

  const [count, setCount] = useState(0);

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <h1>Z backendu: {query.data?.map((planet) => planet.name).join(", ")}</h1>
      <Button onClick={() => mutation.mutate({ name: "Jupiter", description: "Makes you stupider" })}>Dodaj syf</Button>
      <div className="flex p-2 items-center">
        <h1 className="text-xl mr-2">{count}</h1>
        <Button onClick={() => setCount(count + 1)}>+</Button>
        <Button onClick={() => setCount(count - 1)}>-</Button>
      </div>
    </div>
  );
}
