import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import * as React from "react";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Witaj z powrotem</CardTitle>
          <CardDescription>Zaloguj się za pomocą swojego konta Google lub Facebook</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">
                    <path
                      d="M28.458 5c6.167 0 11.346 2.2 15.368 5.804l.323.295l-6.62 6.464c-1.695-1.59-4.666-3.493-9.07-3.493c-6.204 0-11.47 4.093-13.372 9.749c-.47 1.46-.756 3.023-.756 4.64c0 1.615.287 3.18.782 4.639c1.877 5.656 7.142 9.748 13.345 9.748c3.347 0 5.928-.886 7.881-2.176l.251-.17l.307-.222c2.813-2.108 4.144-5.084 4.46-7.169l.03-.22h-12.93v-8.705h22.025c.339 1.46.495 2.867.495 4.795c0 7.142-2.554 13.163-6.985 17.255c-3.884 3.597-9.201 5.682-15.535 5.682c-9.031 0-16.85-5.102-20.772-12.57l-.184-.358l-.222-.457A23.45 23.45 0 0 1 5 28.458c0-3.6.827-7.01 2.28-10.073l.222-.457l.184-.357C11.608 10.1 19.426 5 28.458 5"
                      fill="currentColor"
                    />
                  </svg>
                  Zaloguj się z Google
                </Button>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                    <path
                      d="M59.5 1h-55C2.5 1 1 2.6 1 4.5v55c0 2 1.6 3.5 3.5 3.5h29.6V38.9h-8v-9.3h8v-6.9c0-8 4.8-12.4 12-12.4c2.4 0 4.8.1 7.2.4V19h-4.8c-3.8 0-4.6 1.8-4.6 4.5v5.9H53l-1.3 9.4h-8v23.8h15.8c2 0 3.5-1.5 3.5-3.5V4.5c-.1-2-1.7-3.5-3.5-3.5"
                      fill="currentColor"
                    />
                  </svg>
                  Zaloguj się z Facebook
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Albo kontynuuj z
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Hasło</FieldLabel>
                  <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Zapomniane hasło?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">Zaloguj się</Button>
                <FieldDescription className="text-center">
                  Nie masz konta? <Link to="/sign-up">Zarejestruj się</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Klikając przycisk "Kontynuuj", zgadzasz się na nasze <a href="#">Warunki korzystania z usługi</a> i{" "}
        <a href="#">Politykę prywatności</a>.
      </FieldDescription>
    </div>
  );
}
