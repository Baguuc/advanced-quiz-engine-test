import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { AlertCircleIcon } from "lucide-react";
import { authClient } from "@/lib/auth.ts";
import { GithubLogo } from "%/legal/components/github-logo.tsx";
import { RobloxLogo } from "%/legal/components/roblox-logo.tsx";

const formSchema = z.object({
  email: z.email("Niepoprawny adres email"),
  password: z.string().min(8, "Hasło musi zawierać co najmniej 8 znaków"),
});

export function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const authResult = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (authResult.error) {
      setError(authResult.error.message ?? "Nieznany błąd");
    } else {
      await navigate({ to: "/" });
    }
  };

  type SocialProvider = Parameters<typeof authClient.signIn.social>[0]["provider"];
  const loginSocial = async (provider: SocialProvider) => {
    const data = await authClient.signIn.social({
      provider: provider,
      callbackURL: "http://localhost:5173",
    });

    console.log(data);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Witaj z powrotem</CardTitle>
        <CardDescription>Zaloguj się za pomocą swojego konta Roblox lub Github</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Button variant="outline" type="button" onClick={() => loginSocial("roblox")}>
                <RobloxLogo />
                Zaloguj się z Roblox
              </Button>
              <Button variant="outline" type="button" onClick={() => loginSocial("github")}>
                <GithubLogo />
                Zaloguj się z Github
              </Button>
            </Field>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">Albo kontynuuj z</FieldSeparator>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="m@example.com"
                    autoComplete="email"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Hasło</FieldLabel>
                    <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                      Zapomniane hasło?
                    </a>
                  </div>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="current-password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button type="submit">Zaloguj się</Button>
              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <FieldDescription className="text-center">
                Nie masz konta?{" "}
                <Link to="/sign-up" search={(prev) => prev}>
                  Zarejestruj się
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
