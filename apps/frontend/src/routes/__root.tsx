import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientContext } from "@tanstack/react-query";
import { queryClient } from "@/main.tsx";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "@/components/theme/theme-provider.tsx";
import { NotFound } from "@/components/not-found.tsx";
import { Toaster } from "@/components/ui/toast.tsx";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <QueryClientContext value={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Outlet />
        <Toaster />
      </ThemeProvider>
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientContext>
  );
}
