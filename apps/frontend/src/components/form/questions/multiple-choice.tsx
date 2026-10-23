import type { FormQuestionProps } from "@/components/form/utils.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";

export function FormQuestionMultipleChoice({ question, value, onChange }: FormQuestionProps) {
  if (value && value.type !== "multiple_choice") return null;

  return (
    <div className="grid w-full gap-2">
      {question.options.map((choice) => (
        <label
          key={choice.id}
          className="flex items-center bg-black/5 dark:bg-white/5 p-2 rounded-lg border border-gray-300 dark:border-neutral-700"
        >
          <Checkbox
            checked={value?.options.includes(choice.id) ?? false}
            onCheckedChange={(checked) => {
              if (checked) {
                onChange({ type: "multiple_choice", options: [...(value?.options ?? []), choice.id] });
              } else {
                onChange({
                  type: "multiple_choice",
                  options: (value?.options ?? []).filter((id) => id !== choice.id),
                });
              }
            }}
            className="mr-2"
          />
          {choice.label}
        </label>
      ))}
    </div>
  );
}
