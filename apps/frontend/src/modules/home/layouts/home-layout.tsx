import { Outlet } from "@tanstack/react-router";
import { NavMain } from "%/home/components/nav-main.tsx";

export function HomeLayout() {
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
