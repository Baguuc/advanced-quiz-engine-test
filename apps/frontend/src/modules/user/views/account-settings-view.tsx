import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { authClient } from "@/lib/auth.ts";
import { ChangeNameDialog } from "./change-name-dialog.tsx";
import { ChangePasswordDialog } from "./change-password-dialog.tsx";
import { SessionsCard } from "./sessions-card.tsx";

export function AccountSettingsView() {
  const session = authClient.useSession();
  if (session.error) {
    throw new Error("Ujebałeś konto :(");
  }

  const user = session.data?.user;
  const currentSession = session.data?.session;

  if (!user || !currentSession) {
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
              <ChangeNameDialog currentName={user.name} />
            </FieldLabel>
            <FieldLabel className="justify-start -mt-1">
              <p className="font-semibold">Twoje hasło:</p>
              *******
              <ChangePasswordDialog />
            </FieldLabel>
          </Field>
        </CardContent>
      </Card>
      <SessionsCard currentSessionId={currentSession.id} />
    </div>
  );
}