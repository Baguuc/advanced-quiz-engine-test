import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon, ClipboardCopyIcon, PlusIcon } from "lucide-react";
import { client } from "@/lib/client";
import { randomId, useClipboard, useListState } from "@mantine/hooks";

function FormCreator() {
  const [page, setPage] = useState<"name" | "questions" | "create">("name");
  const [questions, questionHandlers] = useListState([
    {
      key: randomId(),
      question: "Nowe Pytanie",
      options: [
        { key: randomId(), text: "Opcja 1" },
        { key: randomId(), text: "Opcja 2" },
      ],
    },
  ]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ title: "", description: "" });
  const [formUrl, setFormUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const clipboard = useClipboard();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setPage("name");
    }

    setOpen(nextOpen);
  };

  const updateQuestion = (questionIndex: number, value: string) => {
    questionHandlers.setItemProp(questionIndex, "question", value);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const oldOptions = questions[questionIndex].options;
    const newOptions = [...oldOptions];
    newOptions[optionIndex].text = value;

    questionHandlers.setItemProp(questionIndex, "options", newOptions);
  };

  function addQuestion() {
    questionHandlers.append({
      key: randomId(),
      question: "Nowe Pytanie",
      options: [
        { key: randomId(), text: "Opcja 1" },
        { key: randomId(), text: "Opcja 2" },
      ],
    });
  }

  function addOption(questionIndex: number) {
    const oldOptions = questions[questionIndex].options;
    const newOptions = [...oldOptions];
    questionHandlers.setItemProp(questionIndex, "options", newOptions);
  }

  function deleteOption(questionIndex: number, optionIndex: number) {
    const oldOptions = questions[questionIndex].options;
    const newOptions = [...oldOptions];
    newOptions.splice(optionIndex, 1);
    questionHandlers.setItemProp(questionIndex, "options", newOptions);
  }

  const submitForm = () =>
    client.form
      .create({
        ...data,
        status: "published",
        questions: questions.map((question, idx) => {
          return {
            type: "single_choice",
            position: idx,
            required: true,
            title: question.question,
            description: "",
            options: question.options.map((label, idx) => {
              return { label: label.text, position: idx };
            }),
            config: {},
          };
        }),
      })
      .then((url) => setFormUrl(new URL(url, window.location.origin).href))
      .then(() => setPage("create"));

  const closeModal = () => {
    setPage("name");
    setData({ title: "", description: "" });
    questionHandlers.setState([
      {
        key: randomId(),
        question: "Nowe Pytanie",
        options: [
          { key: randomId(), text: "Opcja 1" },
          { key: randomId(), text: "Opcja 2" },
        ],
      },
    ]);
    setOpen(false);
  };

  const copyLink = () => {
    clipboard.copy(formUrl);

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
                  {questions.map((question, questionIndex) => (
                    <div key={question.key} className="mb-4 p-4 border rounded">
                      <Input
                        value={question.question}
                        onChange={(e) => updateQuestion(questionIndex, e.target.value)}
                        className="mb-2"
                      />

                      <div className="mb-2 text-sm m-3 font-semibold  min-w-100">
                        Opcje:
                        <ul>
                          {question.options.map((option, optionIndex) => (
                            <li key={option.key}>
                              <div className="flex items-center justify-content: center; gap-2 m-1">
                                <Input
                                  value={option.text}
                                  onChange={(e) => {
                                    updateOption(questionIndex, optionIndex, e.target.value);
                                  }}
                                  className="mb-1"
                                />
                                <Button
                                  variant="outline"
                                  className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 py-1"
                                  size="sm"
                                  onClick={() => deleteOption(questionIndex, optionIndex)}
                                >
                                  {" "}
                                  X{" "}
                                </Button>
                              </div>
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
                  <div className="mt-2 text-sm decoration-gray-500 bg-white/5 rounded-md p-2 flex items-center gap-2">
                    {formUrl}
                    <Button variant="outline" size="icon" onClick={copyLink}>
                      {copied ? <CheckIcon /> : <ClipboardCopyIcon />}
                    </Button>
                  </div>
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
