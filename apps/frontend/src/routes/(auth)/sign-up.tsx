import { createFileRoute } from "@tanstack/react-router";
import { SignUpView } from "%/auth/views/sign-up-view.tsx";

export const Route = createFileRoute("/(auth)/sign-up")({
  component: SignUpRoute,
});

function SignUpRoute() {
  return <SignUpView />;
}
