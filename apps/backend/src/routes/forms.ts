import { db } from "../db/db.ts";
import { z } from "zod";
import { form } from "../db/schema.ts";
import { base, protectedProcedure } from "../lib/server.ts";

export const listForms = base.handler(async () => {
  return await db.query.form.findMany({
    with: {
      owner: true,
    },
  });
});

export const getForm = base
  .input(z.object({ formId: z.number() }))
  .errors({
    NOT_FOUND: {
      message: "Form not found",
    },
  })
  .handler(async ({ input, errors }) => {
    const result = await db.query.form.findFirst({
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
            },
          },
          columns: {
            formId: false,
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

    if (!result) {
      throw errors.NOT_FOUND();
    }

    return result;
  });

export const createForm = protectedProcedure
  .input(z.object({ title: z.string() }))
  .handler(async ({ input, context }) => {
    await db.insert(form).values({
      ownerId: Number(context.session.user.id),
      title: input.title,
    });
  });
