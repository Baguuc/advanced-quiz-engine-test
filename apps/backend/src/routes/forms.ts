import { db } from "../db/db.ts";
import { z } from "zod";
import { form, form_status, form_visibility, question, question_type, questionOption } from "../db/schema.ts";
import { base, protectedProcedure } from "../lib/server.ts";

export const listForms = base.handler(async () => {
  return await db.query.form.findMany({
    with: {
      owner: true,
    },
  });
});

export const getForm = protectedProcedure
  .input(z.object({ formId: z.number() }))
  .errors({
    NOT_FOUND: {
      message: "Form not found",
    },
    BAD_REQUEST: {},
  })
  .handler(async ({ input, errors, context }) => {
    const form = await db.query.form.findFirst({
      columns: {
        allowAnonymous: false,
        allowMultipleResponses: false,
        ownerId: false,
        status: false,
        visibility: false,
      },
      where: {
        id: input.formId,
      },
      with: {
        questions: {
          with: {
            options: {
              columns: {
                questionId: false,
                correct: false,
              },
              orderBy: {
                position: "asc",
              },
            },
          },
          columns: {
            formId: false,
          },
          orderBy: {
            position: "asc",
          },
        },
        owner: {
          columns: {
            createdAt: false,
            email: false,
            emailVerified: false,
            updatedAt: false,
          },
        },
      },
    });

    if (!form) {
      throw errors.NOT_FOUND();
    }

    const response = await db.query.response.findFirst({
      with: {
        answers: {
          with: {
            answerOptions: true,
          },
        },
      },
      where: { formId: input.formId, userId: Number(context.session.user.id) },
    });

    if (response?.completed) {
      throw errors.BAD_REQUEST({ message: "Odpowiedź została już przesłana" });
    }

    const answers: Record<
      number,
      | {
          type: "single_choice";
          option: number;
        }
      | { type: "multiple_choice"; options: number[] }
    > = {};

    if (response) {
      response.answers.forEach((answer) => {
        const question = form.questions.find((q) => q.id === answer.questionId);
        if (question?.type === "multiple_choice") {
          answers[answer.questionId] = {
            type: "multiple_choice",
            options: answer.answerOptions.map((option) => option.optionId),
          };
        } else {
          answers[answer.questionId] = {
            type: "single_choice",
            option: answer.answerOptions[0].optionId,
          };
        }
      });
    }

    return {
      form,
      answers,
    };
  });

export const createForm = protectedProcedure
  .input(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      status: z.enum(form_status.enumValues).optional(),
      visibility: z.enum(form_visibility.enumValues).optional(),
      allowAnonymous: z.boolean().optional(),
      allowMultipleResponses: z.boolean().optional(),
      questions: z.array(
        z.object({
          type: z.enum(question_type.enumValues),
          title: z.string(),
          description: z.string(),
          position: z.number().int(),
          required: z.boolean(),
          options: z.array(
            z.object({
              label: z.string(),
              position: z.number(),
            }),
          ),
          config: z.json(),
        }),
      ),
    }),
  )
  .errors({
    BAD_REQUEST: {
      message: "Invalid form data",
    },
  })
  .handler(async ({ input, context }) => {
    const formId: number = await db.transaction(async (tx) => {
      const [{ id: formId }] = await tx
        .insert(form)
        .values({
          ownerId: Number(context.session.user.id),
          title: input.title,
          description: input.description,
          status: input.status,
          visibility: input.visibility,
          allowAnonymous: input.allowAnonymous,
          allowMultipleResponses: input.allowMultipleResponses,
        })
        .returning({ id: form.id });

      for (const currentQuestion of input.questions) {
        const [{ id: questionId }] = await tx
          .insert(question)
          .values({
            formId,
            type: currentQuestion.type,
            title: currentQuestion.title,
            description: currentQuestion.description,
            position: currentQuestion.position,
            required: currentQuestion.required,
            config: currentQuestion.config,
          })
          .returning({ id: question.id });

        for (const currentOption of currentQuestion.options) {
          await tx.insert(questionOption).values({
            questionId,
            label: currentOption.label,
            position: currentOption.position,
          });
        }
      }

      return formId;
    });

    // zwraca link do formularza
    // template:
    // /form/{id}
    return `/form/${formId}`;
  });
