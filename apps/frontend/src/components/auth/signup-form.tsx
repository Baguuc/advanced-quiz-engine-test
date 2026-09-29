import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth.ts";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { AlertCircleIcon } from "lucide-react";

const formSchema = z
  .object({
    name: z.string().min(1, "Nazwa jest wymagana"),
    email: z.email("Niepoprawny adres email"),
    password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są zgodne",
    path: ["confirmPassword"],
  });

const placeholders = [
  "xX_ToeCollector9000_Xx",
  "UnpaidInternOfGod",
  "MicrowaveWithOpinions",
  "DefinitelyNotA_Ferret",
  "GrandmaStoleMyRouter",
  "CEOofEatingCrayons",
  "SuspiciouslyWetSock",
  "TaxEvadingPigeon",
  "GregFromTheBasement",
  "ERROR_UserHasNoBitches",
];

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [placeholder] = useState(() => placeholders[Math.floor(Math.random() * placeholders.length)]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const authResult = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (authResult.error) {
      setError(authResult.error.message ?? "Nieznany błąd.");
    } else {
      await navigate({ to: "/" });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Utwórz swoje konto</CardTitle>
          <CardDescription>Wprowadź swój adres email poniżej, aby utworzyć konto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Nazwa użytkownika</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      aria-invalid={fieldState.invalid}
                      placeholder={placeholder}
                      autoComplete="username"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
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
                      placeholder="m@example.com"
                      aria-invalid={fieldState.invalid}
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
                    <FieldLabel htmlFor="password">Hasło</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="new-password"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirm-password">Powtórz hasło</FieldLabel>
                    <Input
                      {...field}
                      id="confirm-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="new-password"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit">Utwórz konto</Button>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <FieldDescription className="text-center">
                  Masz już konto?{" "}
                  <Link to="/sign-in" search={(prev) => prev}>
                    Zaloguj się
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
