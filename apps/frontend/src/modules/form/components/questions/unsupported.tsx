import type { FormQuestionProps } from "%/form/types.ts";

export function FormQuestionUnsupported({ question }: FormQuestionProps) {
  return (
    <>
      <h1 className="text-2xl font-bold text-red-500 text-center">Nieobsługiwany typ pytania: {question.type}</h1>
    </>
  );
}
