import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FormCreator() {
  const [page, setPage] = useState<"name" | "questions" | "create">("name");

  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button variant="outline">Stwórz ankietę</Button>} />
        <DialogContent className="sm:max-w-full w-6/10">
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

              <div className=" scrollbar-auto max-h-[70vh] overflow-y-auto px-4 grid place-items-start">
                <h3 className="mt-4 text-base font-semibold">Larpuj dodawanie pytań do ankiety.</h3>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">Pytanie 1: Jaki jest twój ulubiony sposób musztardyzaji?</h3>
                  <p className="mt-4 text-sm">A. Wąchanie musztardy</p>
                  <p className="mt-4 text-sm">B. Smarowanie musztardą</p>
                  <p className="mt-4 text-sm">C. Jedzenie musztardy</p>
                  <p className="mt-4 text-sm">D. Inne</p>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">Pytanie 2: Jak często w tygoniu się musztardujesz?</h3>
                  <p className="mt-4 text-sm">A. 1-7 razy w tygodniu</p>
                  <p className="mt-4 text-sm">B. 2-14 razy w tygodniu</p>
                  <p className="mt-4 text-sm">C. 14-17 razy w tygodniu</p>
                  <p className="mt-4 text-sm">D. 17-49 razy w tygodniu</p>
                </div>

                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Dodaj Pytanie
                </button>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setPage("name")}>
                  Wróć do nazwy ankiety
                </Button>
                <Button onClick={() => setPage("create")}>Przejdź do finalizacji</Button>
              </DialogFooter>
            </>
          )}

          {page === "create" && (
            <>
              <DialogHeader>
                <DialogTitle>Finalizacja ankiety</DialogTitle>
              </DialogHeader>

              <div className="-mx-4 scrollbar-auto max-h-[70vh] overflow-y-auto px-4 grid place-items-center">
                <h3 className="mt-4 text-base font-semibold">Larpuj generowanie linku do ankiety.</h3>
                <div className="mt-4 text-sm">
                  <h3> Link do ankiety:</h3>
                  <p className="mt-2 text-sm decoration-gray-500">
                    https://musztardoweankiety/ankieta-67/fillout.ruskamafia.org
                  </p>
                </div>
              </div>

              <DialogFooter className="place-items-end">
                <Button variant="outline" onClick={() => setPage("questions")}>
                  Wróć do pytań
                </Button>
                <Button type="submit">Stwórz ankietę</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </form>
    </Dialog>
  );
}

export { FormCreator };
