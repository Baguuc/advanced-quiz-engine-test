import { useState, type FormEvent } from "react";
import { SquarePenIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { authClient } from "@/lib/auth.ts";
import { ErrorAlert } from "./error-alert.tsx";

export function ChangePasswordDialog() {
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
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="ml-auto"
        onClick={() => setOpen(true)}
      >
        <SquarePenIcon />
      </Button>
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