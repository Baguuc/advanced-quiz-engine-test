import * as React from "react";
import type { FormQuestionType } from "%/form/types.ts";
import { FormCard } from "%/form/components/form-card.tsx";

interface QuestionCardProps {
  question: FormQuestionType;
  children: React.ReactNode;
}

export function QuestionCard({ question, children }: QuestionCardProps) {
  return (
    <FormCard className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">
          {question.title}
          {question.required && <span className="text-red-500"> *</span>}
        </h1>
        {question.description && (
          <p className="text-gray-600 dark:text-gray-400 text-justify whitespace-pre-wrap mt-1">
            {question.description}
          </p>
        )}
      </div>
      {children}
    </FormCard>
  );
}
