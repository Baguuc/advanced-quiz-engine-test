import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth.ts";
import { NavMain } from "@/components/navbar/nav-main.tsx";

export const Route = createFileRoute("/(authenticated)")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
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
  return (
    <div>
      <NavMain />
      <Outlet />
    </div>
  );
}
