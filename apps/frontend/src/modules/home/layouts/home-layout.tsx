import { Outlet } from "@tanstack/react-router";
import { NavMain } from "%/home/components/nav-main.tsx";
import { authClient } from "@/lib/auth.ts";

export function HomeLayout() {
  const session = authClient.useSession();

  return (
    <div className="flex min-h-screen flex-col">
      {session.data?.user && <NavMain />}
      <main className="flex-1 bg-muted px-5 py-4 flex justify-center">
        <div className="w-full max-w-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
