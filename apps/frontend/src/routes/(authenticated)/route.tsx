import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth.ts";
import { HomeLayout } from "%/home/layouts/home-layout.tsx";

export const Route = createFileRoute("/(authenticated)")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    // no auth for /form/$id and /form/$id/completed
    if (/^\/form\/\d+(\/completed)?$/.exec(location.href)) {
      return;
    }

    const result = await authClient.getSession();

    if (!result.data) {
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function RouteComponent() {
  return <HomeLayout />;
}
