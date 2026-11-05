import * as React from "react";
import { useState } from "react";
import { client, orpc } from "@/lib/client.ts";
import { useDebouncedCallback } from "@mantine/hooks";
import { isEqual } from "lodash";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast.tsx";
import { isDefinedError } from "@orpc/client";
import { Button } from "@/components/ui/button.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { AlertCircleIcon } from "lucide-react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import type { FormAnswerType, FormQuestionProps, FormQuestionType } from "%/form/types.ts";
import { FormQuestionUnsupported } from "%/form/components/questions/unsupported.tsx";
import { FormQuestionSingleChoice } from "%/form/components/questions/single-choice.tsx";
import { FormQuestionMultipleChoice } from "%/form/components/questions/multiple-choice.tsx";
import { QuestionCard } from "%/form/components/question-card.tsx";
import { FormHeader } from "%/form/components/form-header.tsx";
import { authClient } from "@/lib/auth.ts";

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

export const FormSurveyView = () => {
  const routeApi = getRouteApi("/(authenticated)/form_/$formId/");
  const { form, answers: recordedAnswers } = routeApi.useLoaderData();

  const session = authClient.useSession();
  const authenticatedExperience = !!session.data?.user;

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

  const submitAnonymousMutation = useMutation(
    orpc.response.submitAnonymous.mutationOptions({
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
    if (!authenticatedExperience) return;

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
    if (authenticatedExperience) {
      await answerUpdate();
      await submitMutation.mutateAsync({ formId: form.id });
    } else {
      await submitAnonymousMutation.mutateAsync({
        formId: form.id,
        response: answers,
      });
    }
  };

  const setAnswer = async (questionId: number, answer: FormAnswerType) => {
    if (!started) {
      if (authenticatedExperience) {
        await client.response.start({
          formId: form.id,
        });
      }
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
