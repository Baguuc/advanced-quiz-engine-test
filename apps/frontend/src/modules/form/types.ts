import type { InferClientOutputs } from "@orpc/client";
import type { client } from "@/lib/client.ts";

export type FormListType = InferClientOutputs<typeof client>["form"]["list"][number];
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
