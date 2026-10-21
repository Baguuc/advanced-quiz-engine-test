import { db } from "../db/db.ts";
import { ORPCError } from "@orpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { answer, answerOption, form, response } from "../db/schema.ts";
import { protectedProcedure } from "../lib/server.ts";
import { form, form_status, form_visibility, question, question_type, questionOption } from "../db/schema.ts";
import { base, protectedProcedure } from "../lib/server.ts";

export const listForms = protectedProcedure.handler(async ({ context }) => {
  const userId = Number(context.session.user.id);

  return await db.query.form.findMany({
    where: {
      ownerId: userId,
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

export const getFormDetails = protectedProcedure
  .input(z.object({ formId: z.number() }))
  .handler(async ({ input, context }) => {
    const userId = Number(context.session.user.id);

    const selectedForm = await db.query.form.findFirst({
      where: {
        id: input.formId,
        ownerId: userId,
      },
      with: {
        questions: {
          with: {
            options: true,
          },
        },
      },
    });

    if (!selectedForm) {
      throw new ORPCError("NOT_FOUND", { message: "Form not found" });
    }

    const [responseStats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        completed: sql<number>`count(*) filter (where ${response.completed} = true)::int`,
      })
      .from(response)
      .where(eq(response.formId, input.formId));

    const optionStats = await db
      .select({
        optionId: answerOption.optionId,
        count: sql<number>`count(*)::int`,
      })
      .from(answerOption)
      .innerJoin(answer, eq(answerOption.answerId, answer.id))
      .innerJoin(response, eq(answer.responseId, response.id))
      .where(eq(response.formId, input.formId))
      .groupBy(answerOption.optionId);

    const questionStats = await db
      .select({
        questionId: answer.questionId,
        count: sql<number>`count(*)::int`,
      })
      .from(answer)
      .innerJoin(response, eq(answer.responseId, response.id))
      .where(eq(response.formId, input.formId))
      .groupBy(answer.questionId);

    const optionCounts = new Map(optionStats.map((stat) => [stat.optionId, stat.count]));
    const questionCounts = new Map(questionStats.map((stat) => [stat.questionId, stat.count]));
    const totalResponses = responseStats?.total ?? 0;

    return {
      ...selectedForm,
      responseStats: {
        total: totalResponses,
        completed: responseStats?.completed ?? 0,
      },
      questionResponseStats: selectedForm.questions.map((question) => ({
        questionId: question.id,
        answered: questionCounts.get(question.id) ?? 0,
        options: question.options.map((option) => {
          const count = optionCounts.get(option.id) ?? 0;

          return {
            optionId: option.id,
            count,
            percentage: totalResponses === 0 ? 0 : Math.round((count / totalResponses) * 100),
          };
        }),
      })),
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

      const insertedQuestions = await tx
        .insert(question)
        .values(
          input.questions.map((q) => ({
            formId,
            type: q.type,
            title: q.title,
            description: q.description,
            position: q.position,
            required: q.required,
            config: q.config,
          })),
        )
        .returning({
          id: question.id,
          position: question.position,
        });

      const questionIdByPosition = new Map(insertedQuestions.map((q) => [q.position, q.id]));

      const options = input.questions.flatMap((q) => {
        const questionId = questionIdByPosition.get(q.position);

        if (questionId === undefined) {
          throw new Error(`Question ID not found for position ${q.position}`);
        }

        return q.options.map((option) => ({
          questionId,
          label: option.label,
          position: option.position,
        }));
      });

      if (options.length > 0) {
        await tx.insert(questionOption).values(options);
      }

      return formId;
    });

    return `/form/${formId}`;
  });
