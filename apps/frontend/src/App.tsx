import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";

function App() {
  const query = useQuery({
    queryKey: ["hello"],
    queryFn: () => fetch("http://localhost:3000/users").then((res) => res.text()),
  });

  const mutation = useMutation({
    mutationFn: () =>
      fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "John Doe", email: "john.doe@example.com" }),
      }),
    onSuccess: async () => {
      await query.refetch();
    },
  });

  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Z backendu: {query.data}</h1>
      <Button onClick={() => mutation.mutate()}>Dodaj syf</Button>
      <div className="flex p-2 items-center">
        <h1 className="text-xl mr-2">{count}</h1>
        <Button onClick={() => setCount(count + 1)}>+</Button>
        <Button onClick={() => setCount(count - 1)}>-</Button>
      </div>
    </>
  );
}

export default App;
