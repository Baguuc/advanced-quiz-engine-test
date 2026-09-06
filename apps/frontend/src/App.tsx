import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { usersApi } from "@aqe/common/api/client/users";

function App() {
  const query = useQuery({
    queryKey: ["hello"],
    queryFn: () => usersApi.list(),
  });

  const mutation = useMutation({
    mutationFn: () => usersApi.create({ name: "John Doe", email: "john.doe@example.com" }),
    onSuccess: async () => {
      await query.refetch();
    },
  });

  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Z backendu: {query.data?.map((user) => user.name).join(", ")}</h1>
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
