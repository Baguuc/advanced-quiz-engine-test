import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";

function App() {
  const query = useQuery({
    queryKey: ["hello"],
    queryFn: () => fetch("http://localhost:3000").then((res) => res.text()),
  });
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Z backendu: {query.data}</h1>
      <div className="flex p-2 items-center">
        <h1 className="text-xl mr-2">{count}</h1>
        <Button onClick={() => setCount(count + 1)}>+</Button>
        <Button onClick={() => setCount(count - 1)}>-</Button>
      </div>
    </>
  );
}

export default App;
