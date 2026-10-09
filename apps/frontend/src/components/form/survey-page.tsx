import { FormHeader } from "@/components/form/form-header.tsx";
import { FormCard } from "@/components/form/form-card.tsx";
import { FormQuestionSingleChoice } from "@/components/form/questions/single-choice.tsx";
import * as React from "react";
import { FormQuestionUnsupported } from "@/components/form/questions/unsupported.tsx";
import type { FormQuestionType, FormType } from "@/components/form/utils.ts";

interface SurveyPageProps {
  form: FormType;
}

const questionComponents: Record<FormQuestionType["type"], React.ComponentType<{ question: FormQuestionType }>> = {
  short_text: FormQuestionUnsupported,
  long_text: FormQuestionUnsupported,
  number: FormQuestionUnsupported,
  email: FormQuestionUnsupported,
  date: FormQuestionUnsupported,
  single_choice: FormQuestionSingleChoice,
  multiple_choice: FormQuestionUnsupported,
  dropdown: FormQuestionUnsupported,
  rating: FormQuestionUnsupported,
  linear_scale: FormQuestionUnsupported,
};

export const SurveyPage = ({ form }: SurveyPageProps) => {
  return (
    <div className="flex flex-col gap-5">
      <FormHeader title={form.title} description={form.description} />
      {form.questions
        .toSorted((a, b) => a.position - b.position)
        .map((question) => {
          const QuestionComponent = questionComponents[question.type];

          return (
            <FormCard key={question.id}>
              <QuestionComponent question={question} />
            </FormCard>
          );
        })}
    </div>
  );
};
