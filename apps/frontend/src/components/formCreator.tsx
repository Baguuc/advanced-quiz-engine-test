import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FormCreator() {
  const [page, setPage] = useState<"name" | "questions" | "create">("name");

  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button variant="outline">Stwórz ankietę</Button>} />
        <DialogContent className="sm:max-w-full w-7/10">
          {page === "name" && (
            <>
              <DialogHeader>
                <DialogTitle>Stwórz ankietę</DialogTitle>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <Label htmlFor="formName">Podaj nazwę ankiety*</Label>
                  <Input id="formName" placeholder="Nazwa ankiety" required />
                </Field>
                <Field>
                  <Label htmlFor="formDescription">Podaj opis ankiety</Label>
                  <Input id="formDescription" placeholder="Opis ankiety" />
                </Field>
              </FieldGroup>

              <DialogFooter>
                <Button onClick={() => setPage("questions")}>Zacznij tworzenie ankiety</Button>
              </DialogFooter>
            </>
          )}

          {page === "questions" && (
            <>
              <DialogHeader>
                <DialogTitle>Dodaj pytania do ankiety</DialogTitle>
              </DialogHeader>

              <div className="-mx-4 scrollbar-auto max-h-[70vh] overflow-y-auto px-4">
                Larpuj dodawanie pytań do ankiety. Możesz dodać pytania, ustawić ich typ (np. otwarte, zamknięte) i ustawić opcje odpowiedzi dla pytań zamkniętych.

                <p className="mt-4 text-sm">
                    Larp Pytanie 1 \n CZy six seven to mango i musztarda? \n Odpowiedzi: \n - Tak \n - Nie \n - Może
                </p>

              </div>

              <DialogFooter>
                <Button onClick={() => setPage("name")}>Wróć do nazwy ankiety</Button>
                <Button onClick={() => setPage("create")}>Przejdź do finalizacji</Button>
              </DialogFooter>
            </>
          )}

        </DialogContent>
      </form>
    </Dialog>
  );
}

export { FormCreator };
