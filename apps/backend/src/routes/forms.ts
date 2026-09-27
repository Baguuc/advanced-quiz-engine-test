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

export const createForm = protectedProcedure
  .input(z.object({ title: z.string() }))
  .handler(async ({ input, context }) => {
    await db.insert(form).values({
      ownerId: Number(context.session.user.id),
      title: input.title,
    });
  });
