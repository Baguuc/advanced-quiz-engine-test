import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth/login-form.tsx";
import { CompanyLogo } from "@/components/legal/company-logo.tsx";

export const Route = createFileRoute("/(auth)/sign-in")({
  component: SignInRoute,
});

function SignInRoute() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <CompanyLogo />
        <LoginForm />
      </div>
    </div>
  );
}
