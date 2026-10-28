import { createFileRoute } from "@tanstack/react-router";
import { SignInView } from "%/auth/views/sign-in-view.tsx";

export const Route = createFileRoute("/(auth)/sign-in")({
  component: SignInRoute,
});

function SignInRoute() {
  return <SignInView />;
}
