import { useCallback, useEffect, useState, type FormEvent } from "react";
import { UAParser } from "ua-parser-js";
import { AlertCircleIcon, LogOutIcon, MonitorIcon, SmartphoneIcon, SquarePenIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { authClient } from "@/lib/auth.ts";

/* ------------------------------ Helpers ------------------------------- */

function ErrorAlert({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

/* ---------------------------- Change name ---------------------------- */

function ChangeNameDialog({ currentName }: { currentName: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // If you use the `username` plugin, pass `{ username: name }` instead
    const { error } = await authClient.updateUser({ name: name.trim() });
    setLoading(false);

    if (error) {
      setError(error.message ?? "Nie udało się zmienić nazwy");
      return;
    }
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setName(currentName);
          setError(null);
        }
      }}
    >
      <DialogTrigger render={<Button variant="secondary" size="icon" className="ml-auto" />}>
        <SquarePenIcon />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Zmień nazwę</DialogTitle>
            <DialogDescription>Podaj nową nazwę użytkownika.</DialogDescription>
          </DialogHeader>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            required
            autoFocus
          />
          <ErrorAlert message={error} />
          <DialogFooter>
            <Button type="submit" disabled={loading || !name.trim() || name === currentName}>
              {loading && <Spinner />}
              Zapisz
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------- Change password -------------------------- */

function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  function reset() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;

    setLoading(true);
    setError(null);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true, // logs out all other devices after the change
    });
    setLoading(false);

    if (error) {
      setError(error.message ?? "Nie udało się zmienić hasła");
      return;
    }
    reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger render={<Button variant="secondary" size="icon" className="ml-auto" />}>
        <SquarePenIcon />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Zmień hasło</DialogTitle>
            <DialogDescription>
              Po zmianie hasła zostaniesz wylogowany ze wszystkich innych sesji.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            placeholder="Obecne hasło"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Nowe hasło"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
          />
          <Input
            type="password"
            placeholder="Powtórz nowe hasło"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={mismatch}
            required
          />
          {mismatch && <p className="text-sm text-destructive">Hasła nie są takie same</p>}
          <ErrorAlert message={error} />
          <DialogFooter>
            <Button type="submit" disabled={loading || mismatch}>
              {loading && <Spinner />}
              Zmień hasło
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------ Sessions ------------------------------ */

type SessionItem = typeof authClient.$Infer.Session.session;

const dateFormat = new Intl.DateTimeFormat("pl-PL", {
  dateStyle: "medium",
  timeStyle: "short",
});

function describeDevice(userAgent?: string | null) {
  if (!userAgent) return { label: "Nieznane urządzenie", mobile: false };
  const { browser, os, device } = new UAParser(userAgent).getResult();
  const label =
    [browser.name, os.name].filter(Boolean).join(" na ") || "Nieznane urządzenie";
  return { label, mobile: device.type === "mobile" || device.type === "tablet" };
}

function SessionsCard({ currentSessionId }: { currentSessionId: string }) {
  const [sessions, setSessions] = useState<SessionItem[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null); // token | "others"
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await authClient.listSessions();
    if (error) {
      setError("Nie udało się pobrać sesji");
      setSessions((prev) => prev ?? []);
      return;
    }
    // current session first, then newest activity
    setSessions(
      [...(data ?? [])].sort((a, b) => {
        if (a.id === currentSessionId) return -1;
        if (b.id === currentSessionId) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }),
    );
  }, [currentSessionId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function revokeOne(token: string) {
    setBusy(token);
    setError(null);
    const { error } = await authClient.revokeSession({ token });
    setBusy(null);
    if (error) {
      setError(error.message ?? "Nie udało się wylogować sesji");
      return;
    }
    await load();
  }

  async function revokeOthers() {
    setBusy("others");
    setError(null);
    const { error } = await authClient.revokeOtherSessions();
    setBusy(null);
    if (error) {
      setError(error.message ?? "Nie udało się wylogować sesji");
      return;
    }
    await load();
  }

  const hasOthers = sessions?.some((s) => s.id !== currentSessionId) ?? false;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Sesje użytkownika</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ErrorAlert message={error} />
        {!sessions ? (
          <Spinner className="size-8 mx-auto" />
        ) : (
          <>
            <Button
              variant="destructive"
              className="self-start"
              disabled={!hasOthers || busy !== null}
              onClick={revokeOthers}
            >
              {busy === "others" ? <Spinner /> : <LogOutIcon />}
              Wyloguj ze wszystkich pozostałych sesji
            </Button>

            {sessions.map((s) => {
              const isCurrent = s.id === currentSessionId;
              const { label, mobile } = describeDevice(s.userAgent);
              const DeviceIcon = mobile ? SmartphoneIcon : MonitorIcon;
              // `city` / `country` are custom fields, see the server section from my previous message
              const location =
                [(s as any).city, (s as any).country].filter(Boolean).join(", ") || "Nieznana";

              return (
                <div key={s.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <DeviceIcon className="size-6 shrink-0 text-muted-foreground" />
                  <div className="flex min-w-0 flex-col gap-0.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{label}</span>
                      {isCurrent && <Badge>Ta sesja</Badge>}
                    </div>
                    <span className="text-muted-foreground">
                      Ostatnia aktywność: {dateFormat.format(new Date(s.updatedAt))}
                    </span>
                    <span className="text-muted-foreground">Lokalizacja: {location}</span>
                    <span className="text-muted-foreground">IP: {s.ipAddress || "Nieznany"}</span>
                  </div>
                  {!isCurrent && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="ml-auto shrink-0"
                      disabled={busy !== null}
                      onClick={() => revokeOne(s.token)}
                    >
                      {busy === s.token ? <Spinner /> : <LogOutIcon />}
                      Wyloguj
                    </Button>
                  )}
                </div>
              );
            })}
          </>
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------------------- Page -------------------------------- */

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