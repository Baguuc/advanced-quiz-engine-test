import { protectedProcedure, sessionOptionalProcedure } from "../lib/server.ts";
import { z } from "zod";
import { db } from "../db/db.ts";
import { answer, answerOption, response } from "../db/schema.ts";
import { and, eq, or } from "drizzle-orm";

export const startResponse = protectedProcedure
  .input(z.object({ formId: z.number() }))
  .errors({
    NOT_FOUND: {
      message: "Formularz nie znaleziony",
    },
    NOT_IMPLEMENTED: {},
  })
  .handler(async ({ input, context, errors }) => {
    const userId = Number(context.session.user.id);

    const form = await db.query.form.findFirst({
      where: { id: input.formId },
      with: { responses: { where: { userId } } },
    });

    if (!form) {
      throw errors.NOT_FOUND();
    }

    if (form.responses.length > 0) {
      throw errors.NOT_IMPLEMENTED({ message: "Odpowiadanie kilkukrotnie nie jest obsługiwane" });
    }

    await db.insert(response).values({
      formId: input.formId,
      userId: userId,
      startedAt: new Date(),
      completed: false,
    });
  });

export const updateResponse = protectedProcedure
  .input(
    z.object({
      formId: z.number(),
      response: z.record(
        z.number(),
        z.union([
          z.object({
            type: z.literal("single_choice"),
            option: z.number(),
          }),
          z.object({
            type: z.literal("multiple_choice"),
            options: z.array(z.number()),
          }),
        ]),
      ),
    }),
  )
  .errors({
    CONFLICT: {
      message: "Formularz nie jest rozpoczęty",
    },
    BAD_REQUEST: {},
  })
  .handler(async ({ input, context, errors }) => {
    const userId = Number(context.session.user.id);

    await db.transaction(async (tx) => {
      const form = await db.query.response.findFirst({
        with: {
          form: {
            with: {
              questions: {
                with: {
                  options: true,
                },
              },
            },
          },
          answers: {
            with: {
              answerOptions: true,
            },
          },
        },
        where: { formId: input.formId, userId },
      });

      if (!form) {
        throw errors.CONFLICT();
      }

      const answersByQuestion = new Map(form.answers.map((item) => [item.questionId, item]));

      const submitted = Object.entries(input.response).map(([questionId, value]) => ({
        questionId: Number(questionId),
        optionIds: value.type === "single_choice" ? [value.option] : [...new Set(value.options)],
      }));

      const questionById = new Map(form.form.questions.map((question) => [question.id, question]));

      for (const { questionId, optionIds } of submitted) {
        const question = questionById.get(questionId);

        if (!question) {
          throw errors.BAD_REQUEST({ message: "Nie znaleziono pytania" });
        }

        const validOptionIds = new Set(question.options.map((option) => option.id));

        if (optionIds.some((optionId) => !validOptionIds.has(optionId))) {
          throw errors.BAD_REQUEST({ message: "Nieznane odpowiedzi" });
        }
      }

      const missingQuestions = submitted.filter(({ questionId }) => !answersByQuestion.has(questionId));

      if (missingQuestions.length > 0) {
        const createdAnswers = await tx
          .insert(answer)
          .values(missingQuestions.map(({ questionId }) => ({ responseId: form.id, questionId })))
          .returning();

        for (const created of createdAnswers) {
          answersByQuestion.set(created.questionId, {
            ...created,
            answerOptions: [],
          });
        }
      }

      const optionsToInsert: {
        answerId: number;
        optionId: number;
      }[] = [];

      const optionsToDelete: {
        answerId: number;
        optionId: number;
      }[] = [];

      for (const { questionId, optionIds } of submitted) {
        const currentAnswer = answersByQuestion.get(questionId);

        if (!currentAnswer) {
          throw new Error(`Failed to create answer for question ${questionId}`);
        }

        const existingOptions = new Set(currentAnswer.answerOptions.map(({ optionId }) => optionId));
        const desiredOptions = new Set(optionIds);

        for (const optionId of desiredOptions) {
          if (!existingOptions.has(optionId)) {
            optionsToInsert.push({
              answerId: currentAnswer.id,
              optionId,
            });
          }
        }

        for (const option of currentAnswer.answerOptions) {
          if (!desiredOptions.has(option.optionId)) {
            optionsToDelete.push({
              answerId: option.answerId,
              optionId: option.optionId,
            });
          }
        }
      }

      if (optionsToDelete.length > 0) {
        await tx
          .delete(answerOption)
          .where(
            or(
              ...optionsToDelete.map(({ answerId, optionId }) =>
                and(eq(answerOption.answerId, answerId), eq(answerOption.optionId, optionId)),
              ),
            ),
          );
      }

      if (optionsToInsert.length > 0) {
        await tx.insert(answerOption).values(optionsToInsert);
      }
    });
  });

export const submitResponse = protectedProcedure
  .input(
    z.object({
      formId: z.number(),
    }),
  )
  .errors({
    BAD_REQUEST: {},
  })
  .handler(async ({ input, context, errors }) => {
    const userId = Number(context.session.user.id);

    const userResponse = await db.query.response.findFirst({
      with: {
        form: {
          with: {
            questions: true,
          },
        },
        answers: {
          with: {
            answerOptions: true,
          },
        },
      },
      where: { formId: input.formId, userId },
    });

    if (!userResponse) {
      throw errors.BAD_REQUEST({ message: "Nie znaleziono odpowiedzi" });
    }

    if (userResponse.completed) {
      throw errors.BAD_REQUEST({ message: "Odpowiedź została już przesłana" });
    }

    const requiredQuestionIds = userResponse.form.questions
      .filter((question) => question.required)
      .map((question) => question.id);

    for (const requiredQuestionId of requiredQuestionIds) {
      if (!userResponse.answers.find((answer) => answer.questionId === requiredQuestionId)?.answerOptions.length) {
        throw errors.BAD_REQUEST({ message: "Brak odpowiedzi na pytanie wymagane" });
      }
    }

    await db.update(response).set({ completed: true }).where(eq(response.id, userResponse.id));
  });

export const submitAnonymousResponse = sessionOptionalProcedure
  .input(
    z.object({
      formId: z.number(),
      response: z.record(
        z.coerce.number().int().positive(),
        z.union([
          z.object({
            type: z.literal("single_choice"),
            option: z.number(),
          }),
          z.object({
            type: z.literal("multiple_choice"),
            options: z.array(z.number()),
          }),
        ]),
      ),
    }),
  )
  .errors({
    NOT_FOUND: {},
    BAD_REQUEST: {},
  })
  .handler(async ({ input, context, errors }) => {
    if (context.session) {
      throw errors.BAD_REQUEST({ message: "Ten endpoint jest tylko dla użytkowników anonimowych." });
    }

    await db.transaction(async (tx) => {
      const form = await tx.query.form.findFirst({
        with: {
          questions: {
            with: {
              options: true,
            },
          },
        },
        where: { id: input.formId },
      });

      if (!form) {
        throw errors.NOT_FOUND({ message: "Nie znaleziono formularza." });
      }

      if (!form.allowAnonymous) {
        throw errors.BAD_REQUEST({ message: "Formularz nie zezwala na anonimowe odpowiedzi" });
      }

      const submitted = Object.entries(input.response).map(([questionId, value]) => ({
        questionId: Number(questionId),
        optionIds: value.type === "single_choice" ? [value.option] : [...new Set(value.options)],
      }));

      const questionById = new Map(form.questions.map((question) => [question.id, question]));

      for (const { questionId, optionIds } of submitted) {
        const question = questionById.get(questionId);

        if (!question) {
          throw errors.BAD_REQUEST({ message: "Nie znaleziono pytania" });
        }

        const validOptionIds = new Set(question.options.map((option) => option.id));

        if (optionIds.some((optionId) => !validOptionIds.has(optionId))) {
          throw errors.BAD_REQUEST({ message: "Nieznane odpowiedzi" });
        }
      }

      const submittedByQuestion = new Map(submitted.map((item) => [item.questionId, item]));

      for (const question of form.questions) {
        if (question.required && !submittedByQuestion.get(question.id)?.optionIds.length) {
          throw errors.BAD_REQUEST({ message: "Brak odpowiedzi na pytanie wymagane" });
        }
      }

      const [{ id: responseId }] = await tx
        .insert(response)
        .values({
          formId: form.id,
          userId: null,
          completed: true,
          submittedAt: new Date(),
        })
        .returning({ id: response.id });

      if (submitted.length === 0) {
        return;
      }

      const createdAnswers = await tx
        .insert(answer)
        .values(submitted.map(({ questionId }) => ({ responseId, questionId })))
        .returning();

      const optionsToInsert = createdAnswers.flatMap(({ id: answerId, questionId }) =>
        submittedByQuestion.get(questionId)!.optionIds.map((optionId) => ({ answerId, optionId })),
      );

      if (optionsToInsert.length > 0) {
        await tx.insert(answerOption).values(optionsToInsert);
      }
    });
  });

export const queryCompletionScreen = protectedProcedure
  .input(
    z.object({
      formId: z.number(),
    }),
  )
  .errors({
    BAD_REQUEST: {},
  })
  .handler(async ({ input, context, errors }) => {
    const userId = Number(context.session.user.id);

    const userResponse = await db.query.response.findFirst({
      with: {
        form: true,
      },
      where: { formId: input.formId, userId },
    });

    if (!userResponse) {
      throw errors.BAD_REQUEST();
    }

    if (!userResponse.completed) {
      throw errors.BAD_REQUEST();
    }

    return {
      title: userResponse.form.title,
    };
  });
