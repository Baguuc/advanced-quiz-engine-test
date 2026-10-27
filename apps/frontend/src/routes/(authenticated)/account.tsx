import { createFileRoute } from "@tanstack/react-router";
import { AccountSettingsView } from "%/user/views/account-settings-view.tsx";

export const Route = createFileRoute("/(authenticated)/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AccountSettingsView />;
}
