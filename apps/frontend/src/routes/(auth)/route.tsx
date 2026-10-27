import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth.ts";
import { AuthLayout } from "%/auth/layouts/auth-layout.tsx";

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
  beforeLoad: async () => {
    const result = await authClient.getSession();

    if (result.data) {
      throw redirect({
        to: "/",
      });
    }
  },
});
