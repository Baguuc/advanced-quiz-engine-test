import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon, ClipboardCopyIcon, PlusIcon } from "lucide-react";
import { client } from "@/lib/client";
import { randomId, useClipboard, useListState } from "@mantine/hooks";
import SingleSelectQE from "@/components/question_editors/singleSelectQE";
import MultiSelectQE from "@/components/question_editors/multiSelectQE";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import type { FormQuestionType } from "%/form/types.ts";

interface FormCreatorQuestionType {
  key: string;
  question: string;
  type: FormQuestionType["type"];
  options: {
    key: string;
    text: string;
  }[];
}

function FormCreator() {
  const [page, setPage] = useState<"name" | "questions" | "create">("name");
  const [questions, questionHandlers] = useListState<FormCreatorQuestionType>([
    {
      key: randomId(),
      question: "Nowe Pytanie",
      type: "single_choice",
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
      setData({ title: "", description: "" });
      questionHandlers.setState([
        {
          key: randomId(),
          question: "Nowe Pytanie",
          type: "single_choice",
          options: [
            { key: randomId(), text: "Opcja 1" },
            { key: randomId(), text: "Opcja 2" },
          ],
        },
      ]);
    }

    setOpen(nextOpen);
  };

  function addQuestion(type: "single_choice" | "multiple_choice") {
    questionHandlers.append({
      key: randomId(),
      question: "Nowe Pytanie",
      type: type,
      options: [
        { key: randomId(), text: "Opcja 1" },
        { key: randomId(), text: "Opcja 2" },
      ],
    });
  }

  const updateQuestion = (questionIndex: number, value: string) => {
    questionHandlers.setItemProp(questionIndex, "question", value);
  };

  function addOption(questionIndex: number) {
    const oldOptions = questions[questionIndex].options;
    const newOptions = [
      ...oldOptions,
      {
        key: randomId(),
        text: `Opcja ${oldOptions.length + 1}`,
      },
    ];
    questionHandlers.setItemProp(questionIndex, "options", newOptions);
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const oldOptions = questions[questionIndex].options;
    const newOptions = [...oldOptions];
    newOptions[optionIndex].text = value;

    questionHandlers.setItemProp(questionIndex, "options", newOptions);
  };

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
            type: question.type,
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
                      {question.type}

                      {question.type === "single_choice" && (
                        <SingleSelectQE
                          options={question.options}
                          questionIndex={questionIndex}
                          updateOption={updateOption}
                          deleteOption={deleteOption}
                          addOption={addOption}
                        />
                      )}

                      {question.type === "multiple_choice" && (
                        <MultiSelectQE
                          options={question.options}
                          questionIndex={questionIndex}
                          updateOption={updateOption}
                          deleteOption={deleteOption}
                          addOption={addOption}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="outline"
                        className="mt-4 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 font-bold px-4 w-50 h-10"
                      >
                        {" "}
                        Dodaj Pytanie{" "}
                      </Button>
                    }
                  ></DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => addQuestion("single_choice")}>Pojedynczy wybór</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addQuestion("multiple_choice")}>
                        Wielokrotny wybór
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                <Button type="submit" onClick={() => setOpen(false)}>
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
