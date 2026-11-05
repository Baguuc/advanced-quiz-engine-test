import { useCallback, useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";
import { LogOutIcon, MonitorIcon, SmartphoneIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { authClient } from "@/lib/auth.ts";
import { ErrorAlert } from "./error-alert.tsx";

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

export function SessionsCard({ currentSessionId }: { currentSessionId: string }) {
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
              // `city` / `country` are custom fields (server setup from my first message)
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