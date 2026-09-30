import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";

function FormCreator() {
  const [page, setPage] = useState<"name" | "questions" | "create">("name");
  const [questions, setQuestions] = useState([{ question: "Nowe Pytanie", options: ["Opcja 1", "Opcja 2"] }]);

  const updateQuestion = (questionIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((question, index) => (index === questionIndex ? { ...question, question: value } : question)),
    );
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: question.options.map((option, index) => (index === optionIndex ? value : option)),
            }
          : question,
      ),
    );
  };

  function addQuestion() {
    setQuestions((prev) => [...prev, { question: "Nowe Pytanie", options: ["Opcja 1", "Opcja 2"] }]);
  }

  function addOption(questionIndex: number) {
    setQuestions((prev) =>
      prev.map((question, index) =>
        index === questionIndex ? { ...question, options: [...question.options, "Nowa Opcja"] } : question,
      ),
    );
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger
          render={
            <Button variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" />
          }
        >
          <PlusIcon />
          Stwórz ankietę
        </DialogTrigger>
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

              <div className="max-h-[70vh] overflow-y-auto px-4 grid place-items-center">
                <h3 className="mt-4 text-base font-semibold">Larpuj dodawanie pytań do ankiety.</h3>

                <div className="scrollbar-auto max-h-[50vh] overflow-y-auto px-4 m-5 grid place-items-center">
                  {questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="mb-4 p-4 border rounded">
                      <Input
                        value={question.question}
                        onChange={(e) => updateQuestion(questionIndex, e.target.value)}
                        className="mb-2"
                      />

                      <div className="mb-2 text-sm m-3 font-semibold">
                        Opcje:
                        <ul>
                          {question.options.map((option, optionIndex) => (
                            <li key={optionIndex}>
                              <Input
                                value={option}
                                onChange={(e) => {
                                  updateOption(questionIndex, optionIndex, e.target.value);
                                }}
                                className="mb-1"
                              />
                            </li>
                          ))}
                        </ul>
                        <Button variant="secondary" onClick={() => addOption(questionIndex)}>
                          Dodaj Opcję
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 w-50 h-10"
                  onClick={addQuestion}
                >
                  Dodaj Pytanie
                </Button>
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
