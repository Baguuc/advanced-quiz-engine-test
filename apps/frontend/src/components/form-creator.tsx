import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { client } from "@/lib/client";

function FormCreator() {
  const [page, setPage] = useState<"name" | "questions" | "create">("name");
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "Nowe Pytanie",
      options: [
        { id: 1, text: "Opcja 1" },
        { id: 2, text: "Opcja 2" },
      ],
    },
  ]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ title: "", description: "" });
  const [formUrl, setFormUrl] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setPage("name");
    }

    setOpen(nextOpen);
  };

  const updateQuestion = (questionId: number, value: string) => {
    setQuestions((prev) =>
      prev.map((question) => (question.id === questionId ? { ...question, question: value } : question)),
    );
  };

  const updateOption = (questionId: number, optionId: number, value: string) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) => (option.id === optionId ? { ...option, text: value } : option)),
            }
          : question,
      ),
    );
  };

  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length + 1, //To jest git?
        question: "Nowe Pytanie",
        options: [
          { id: 1, text: "Opcja 1" },
          { id: 2, text: "Opcja 2" },
        ],
      },
    ]);
  }

  function addOption(questionId: number) {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, options: [...question.options, { id: question.options.length + 1, text: "Nowa Opcja" }] }
          : question,
      ),
    );
  }

  function deleteOption(questionId: number, optionId: number) {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.filter((option) => option.id !== optionId),
            }
          : question,
      ),
    );
  }

  const submitForm = () =>
    client.form
      .create({
        ...data,
        questions: questions.map((question, idx) => {
          return {
            type: "single_choice",
            position: idx,
            required: true,
            title: question.question,
            description: "",
            config: { options: question.options },
          };
        }),
      })
      .then((url) => setFormUrl(url))
      .then(() => setPage("create"));

  const closeModal = () => {
    setPage("name");
    setData({ title: "", description: "" });
    setQuestions([
      {
        question: "Nowe Pytanie",
        options: [
          { id: 0, text: "Opcja 1" },
          { id: 1, text: "Opcja 2" },
        ],
      },
    ]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
                  <Input
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    id="formName"
                    placeholder="Nazwa ankiety"
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="formDescription">Podaj opis ankiety</Label>
                  <Input
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    id="formDescription"
                    placeholder="Opis ankiety"
                  />
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
                  {questions.map((question) => (
                    <div key={question.id} className="mb-4 p-4 border rounded">
                      <Input
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, e.target.value)}
                        className="mb-2"
                      />

                      <div className="mb-2 text-sm m-3 font-semibold  min-w-100">
                        Opcje:
                        <ul>
                          {question.options.map((option) => (
                            <li key={option.id}>
                              <div className="flex items-center justify-content: center; gap-2 m-1">
                                <Input
                                  value={option.text}
                                  onChange={(e) => {
                                    updateOption(question.id, option.id, e.target.value);
                                  }}
                                  className="mb-1"
                                />
                                <Button
                                  variant="outline"
                                  className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 py-1"
                                  size="sm"
                                  onClick={() => deleteOption(question.id, option.id)}
                                >
                                  {" "}
                                  X{" "}
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <Button variant="secondary" onClick={() => addOption(question.id)}>
                          Dodaj Opcję
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="mt-4 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 font-bold px-4 w-50 h-10"
                  onClick={addQuestion}
                >
                  Dodaj Pytanie
                </Button>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setPage("name")}>
                  Wróć do nazwy ankiety
                </Button>
                <Button onClick={submitForm}>Stwórz ankietę</Button>
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
                  <p className="mt-2 text-sm decoration-gray-500">{formUrl}</p>
                </div>
              </div>

              <DialogFooter className="place-items-end">
                <Button variant="outline" onClick={() => setPage("questions")}>
                  Wróć do pytań
                </Button>
                <Button type="submit" onClick={closeModal}>
                  OK
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </form>
    </Dialog>
  );
}

export { FormCreator };
