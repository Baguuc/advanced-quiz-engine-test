import type { FormQuestionProps } from "@/components/form/utils.ts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";

export function FormQuestionSingleChoice({ question }: FormQuestionProps) {
  return (
    <>
      <h1 className="text-2xl font-semibold">
        {question.title}
        {question.required && <span className="text-red-500"> *</span>}
      </h1>
      {question.description && (
        <p className="text-gray-600 dark:text-gray-400 text-justify whitespace-pre-wrap mt-1">{question.description}</p>
      )}
      <RadioGroup className="mt-4">
        {question.options.map((choice) => (
          <label
            key={choice.label}
            className="flex items-center bg-black/5 dark:bg-white/5 p-2 rounded-lg border border-gray-300 dark:border-neutral-700"
          >
            <RadioGroupItem value={choice.label} className="mr-2" />
            {choice.label}
          </label>
        ))}
      </RadioGroup>
    </>
  );
}
