import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Button } from "@/components/ui/button.tsx";
import { authClient } from "@/lib/auth.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { SquarePenIcon } from "lucide-react";

export function AccountSettingsView() {
  const session = authClient.useSession();
  if (session.error) {
    throw new Error("Ujebałeś konto :(");
  }

  const user = session.data?.user;

  if (!user) {
    return <Spinner className="size-10 mx-auto mt-5" />;
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-3xl font-bold">Ustawienia konta</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Dane użytkownika</CardTitle>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel className="justify-start -mt-1">
              <p className="font-semibold">Twoja nazwa:</p>
              {user.name}
              <Button variant="secondary" size="icon" className="ml-auto">
                <SquarePenIcon />
              </Button>
            </FieldLabel>
            <FieldLabel className="justify-start -mt-1">
              <p className="font-semibold">Twoje hasło:</p>
              *******
              <Button variant="secondary" size="icon" className="ml-auto">
                <SquarePenIcon />
              </Button>
            </FieldLabel>
          </Field>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Sesje użytkownika</CardTitle>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel>[Tu będą sesje]</FieldLabel>
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
