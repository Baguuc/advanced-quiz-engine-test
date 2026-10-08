import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignupForm } from "@/components/auth/signup-form.tsx";
import { authClient } from "@/lib/auth.ts";
import { CompanyLogo } from "@/components/legal/company-logo.tsx";

export const Route = createFileRoute("/(auth)/sign-up")({
  component: SignUpRoute,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (session.data) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function SignUpRoute() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <CompanyLogo />
        <SignupForm />
      </div>
    </div>
  );
}
