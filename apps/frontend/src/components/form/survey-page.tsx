import { FormHeader } from "@/components/form/form-header.tsx";
import { FormQuestionSingleChoice } from "@/components/form/questions/single-choice.tsx";
import * as React from "react";
import { useState } from "react";
import { FormQuestionUnsupported } from "@/components/form/questions/unsupported.tsx";
import type { FormAnswerType, FormQuestionProps, FormQuestionType, FormType } from "@/components/form/utils.ts";
import { FormQuestionMultipleChoice } from "@/components/form/questions/multiple-choice.tsx";
import { QuestionCard } from "@/components/form/questions/question-card.tsx";
import { client, orpc } from "@/lib/client.ts";
import { useDebouncedCallback } from "@mantine/hooks";
import { isEqual } from "lodash";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast.tsx";
import { isDefinedError } from "@orpc/client";
import { Button } from "@/components/ui/button.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { AlertCircleIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface SurveyPageProps {
  form: FormType;
  recordedAnswers: Record<number, FormAnswerType>;
}

const questionComponents: Record<FormQuestionType["type"], React.ComponentType<FormQuestionProps>> = {
  short_text: FormQuestionUnsupported,
  long_text: FormQuestionUnsupported,
  number: FormQuestionUnsupported,
  email: FormQuestionUnsupported,
  date: FormQuestionUnsupported,
  single_choice: FormQuestionSingleChoice,
  multiple_choice: FormQuestionMultipleChoice,
  dropdown: FormQuestionUnsupported,
  rating: FormQuestionUnsupported,
  linear_scale: FormQuestionUnsupported,
};

export const SurveyPage = ({ form, recordedAnswers }: SurveyPageProps) => {
  const [answers, setAnswers] = useState<Record<number, FormAnswerType>>(recordedAnswers);
  const [lastAnswers, setLastAnswers] = useState<Record<number, FormAnswerType>>(recordedAnswers);
  const [started, setStarted] = useState(Object.keys(recordedAnswers).length > 0);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const navigate = useNavigate();

  const updateAnswersMutation = useMutation(
    orpc.response.update.mutationOptions({
      onSuccess: () => {
        toast.update("submitting", { type: "success", description: "Odpowiedzi zostały zapisane" });
      },
      onError: () => {
        toast.update("submitting", { type: "error", description: "Wystąpił błąd podczas zapisywania odpowiedzi" });
      },
    }),
  );

  const submitMutation = useMutation(
    orpc.response.submit.mutationOptions({
      onSuccess: async () => {
        setSubmissionError(null);
        await navigate({ to: "/form/$formId/completed", params: { formId: form.id.toString() } });
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          setSubmissionError(error.message);
        } else {
          setSubmissionError("Wystąpił błąd podczas wysyłania odpowiedzi");
        }
      },
    }),
  );

  const answerUpdate = async () => {
    const changes: typeof answers = {};

    Object.entries(answers).forEach(([questionId, answer]) => {
      if (!isEqual(answer, lastAnswers[Number(questionId)])) {
        changes[Number(questionId)] = answer;
      }
    });

    toast.add({
      id: "submitting",
      type: "loading",
      description: "Zapisywanie odpowiedzi",
    });
    await updateAnswersMutation.mutateAsync({
      formId: form.id,
      response: changes,
    });

    setLastAnswers(answers);
  };

  const answerUpdateDebounced = useDebouncedCallback(answerUpdate, 2500);

  const submitForm = async () => {
    answerUpdateDebounced.cancel();
    await answerUpdate();
    await submitMutation.mutateAsync({ formId: form.id });
  };

  const setAnswer = async (questionId: number, answer: FormAnswerType) => {
    if (!started) {
      await client.response.start({
        formId: form.id,
      });
      setStarted(true);
    }

    console.log(questionId, answer);

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));

    answerUpdateDebounced();
  };

  return (
    <div className="flex flex-col gap-5">
      <FormHeader form={form} />
      {form.questions
        .toSorted((a, b) => a.position - b.position)
        .map((question) => {
          const QuestionComponent = questionComponents[question.type];

          return (
            <QuestionCard key={question.id} question={question}>
              <QuestionComponent
                question={question}
                value={answers[question.id]}
                onChange={(value) => setAnswer(question.id, value)}
              />
            </QuestionCard>
          );
        })}
      {submissionError && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Wystąpił błąd podczas przesyłania odpowiedzi</AlertTitle>
          <AlertDescription>{submissionError}</AlertDescription>
        </Alert>
      )}
      <Button className="text-1xl h-10 w-min self-end" onClick={submitForm}>
        Prześlij odpowiedzi
      </Button>
    </div>
  );
};
