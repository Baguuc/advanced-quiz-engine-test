import type { FormQuestionProps } from "@/components/form/utils.ts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";

export function FormQuestionSingleChoice({ question, value, onChange }: FormQuestionProps) {
  if (value && value.type !== "single_choice") return null;

  return (
    <RadioGroup
      value={value?.option ?? null}
      onValueChange={(option) => onChange({ type: "single_choice", option: option as number })}
    >
      {question.options.map((choice) => (
        <label
          key={choice.id}
          className="flex items-center bg-black/5 dark:bg-white/5 p-2 rounded-lg border border-gray-300 dark:border-neutral-700"
        >
          <RadioGroupItem value={choice.id} className="mr-2" />
          {choice.label}
        </label>
      ))}
    </RadioGroup>
  );
}
