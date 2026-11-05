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

export function ChangeNameDialog({ currentName }: { currentName: string }) {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="ml-auto"
        onClick={() => {
          setName(currentName);
          setError(null);
          setOpen(true);
        }}
      >
        <SquarePenIcon />
      </Button>
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