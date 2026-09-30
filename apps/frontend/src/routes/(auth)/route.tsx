import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth.ts";

export const Route = createFileRoute("/(auth)")({
  beforeLoad: async () => {
    const result = await authClient.getSession();

    if (result.data) {
      throw redirect({
        to: "/",
      });
    }
  },
});
