import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth.ts";

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
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
