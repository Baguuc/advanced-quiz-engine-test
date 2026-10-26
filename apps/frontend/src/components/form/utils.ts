import type { client } from "@/lib/client.ts";
import type { InferClientOutputs } from "@orpc/client";

export type FormType = InferClientOutputs<typeof client>["form"]["get"]["form"];
export type FormQuestionType = FormType["questions"][number];

export interface FormQuestionProps {
  question: FormQuestionType;
  value?: FormAnswerType;
  onChange: (answer: FormAnswerType) => void;
}

export interface FormSingleSelectAnswer {
  type: "single_choice";
  option: number;
}

export interface FormMultiSelectAnswer {
  type: "multiple_choice";
  options: number[];
}

export type FormAnswerType = FormSingleSelectAnswer | FormMultiSelectAnswer;
