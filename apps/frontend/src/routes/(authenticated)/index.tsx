import { createFileRoute } from "@tanstack/react-router";
import { client } from "@/lib/client";
import { safe } from "@orpc/client";
import { HomeView } from "%/home/views/home-view.tsx";

export const Route = createFileRoute("/(authenticated)/")({
  component: Index,
  loader: async () => {
    const [error, data] = await safe(client.form.list());

    if (error) {
      console.error(error);
      throw error;
    } else {
      return data;
    }
  },
});

function Index() {
  return <HomeView />;
}
