import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { orpc } from "@/lib/client.ts";
import { FormCreator } from "@/components/formCreator";
import { authClient } from "@/lib/auth.ts";
import { Input } from "@/components/ui/input.tsx";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const query = useQuery(orpc.form.list.queryOptions());

  const mutation = useMutation(
    orpc.form.create.mutationOptions({
      onSuccess: async () => {
        await query.refetch();
      },
    }),
  );

  const signUp = async () => {
    await authClient.signUp.email({
      email: "test@example.com",
      password: "password",
      name: "test",
    });
  };

  const [title, setTitle] = useState("");

  return (
    <div className="p-2">
      <FormCreator />
      <h3>Welcome Home!</h3>
      <div className="p-2">
        <Button onClick={() => void signUp()}>Sign Up</Button>
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button onClick={() => void mutation.mutate({ title })}>Create</Button>

        <ol>
          {query.data?.map((form) => (
            <li key={form.id}>{form.title}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
