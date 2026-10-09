import type { client } from "@/lib/client.ts";
import type { InferClientOutputs } from "@orpc/client";

export type FormType = InferClientOutputs<typeof client>["form"]["get"];
export type FormQuestionType = FormType["questions"][number];

export interface FormQuestionProps {
  question: FormQuestionType;
}