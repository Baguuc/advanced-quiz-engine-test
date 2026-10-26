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
    <div className="flex min-h-screen flex-col">
      <NavMain />
      <main className="flex-1 bg-muted px-5 py-4 flex justify-center">
        <div className="w-full max-w-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
