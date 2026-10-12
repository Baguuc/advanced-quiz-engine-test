import { describe, it, expect, assert} from "vitest";
import { call, ORPCError } from "@orpc/server";
import { form, question } from "../../../src/db/schema.ts";
import { db } from "../../../src/db/db.ts";
import { router } from "../../../src/routes/index.ts";
import { createTestUser } from "../../lib/auth.ts";
import { generateRandomFormData } from "../../lib/form.ts";
import { faker } from "@faker-js/faker";
import { randomInteger } from "../../lib/index.ts";

describe("testing form creation", () => {
  it("successfully creates a form", async () => {
    /* inicjalizuj testowego użytkownika */
    const data = generateRandomFormData();
    const sessionCookie = await createTestUser();

    await call(
      router.form.create,
      data,
      {
        context: {
          reqHeaders: new Headers({
            cookie: sessionCookie,
          }),
        },
      }
    );

    const forms = await db.select().from(form);
    assert(forms.length == 1);
  });

  it("successfully creates a questions", async () => {
    /* inicjalizuj testowego użytkownika */
    const data = generateRandomFormData();
    const sessionCookie = await createTestUser();

    await call(
      router.form.create,
      data,
      {
        context: {
          reqHeaders: new Headers({
            cookie: sessionCookie,
          }),
        },
      }
    );

    const questions = await db.select().from(question);
    assert(questions.length > 0);
  });

  it("returns form's url", async () => {
    /* inicjalizuj testowego użytkownika */
    const data = generateRandomFormData();
    const sessionCookie = await createTestUser();

    const result = await call(
      router.form.create,
      data,
      {
        context: {
          reqHeaders: new Headers({
            cookie: sessionCookie,
          }),
        },
      }
    );

    // sprawdź czy zwrócony url  
    assert(result.startsWith("/"));
    const splitted = result.split("/");
    assert(splitted.length === 3);
    assert(splitted[1] === "form");
    assert(Number(splitted[2]));
  });

  it("fails when any question has", async () => {
    /* inicjalizuj testowego użytkownika */
    const data = generateRandomFormData();
    // zamień typ jednego z pytań na losowy string (nie jest poprawny)
    data.questions[randomInteger(0, data.questions.length-1)].type = faker.string.sample();
    const sessionCookie = await createTestUser();

    try {
      await call(
        router.form.create,
        data,
        {
          context: {
            reqHeaders: new Headers({
              cookie: sessionCookie,
            }),
          },
        }
      );

      throw new Error("Expected the procedure to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(ORPCError);
      expect((error as ORPCError<string, string>).code).toBe("BAD_REQUEST");
    }
  });

  it("fails when the form visibility has invalid value", async () => {
    /* inicjalizuj testowego użytkownika */
    const data = generateRandomFormData();
    data.visibility = faker.string.sample() as any;
    const sessionCookie = await createTestUser();

    try {
      await call(
        router.form.create,
        data,
        {
          context: {
            reqHeaders: new Headers({
              cookie: sessionCookie,
            }),
          },
        }
      );

      throw new Error("Expected the procedure to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(ORPCError);
      expect((error as ORPCError<string, string>).code).toBe("BAD_REQUEST");
    }
  });

  it("fails when the form status has invalid value", async () => {
    /* inicjalizuj testowego użytkownika */
    const data = generateRandomFormData();
    data.status = faker.string.sample() as any;
    const sessionCookie = await createTestUser();

    try {
      await call(
        router.form.create,
        data,
        {
          context: {
            reqHeaders: new Headers({
              cookie: sessionCookie,
            }),
          },
        }
      );

      throw new Error("Expected the procedure to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(ORPCError);
      expect((error as ORPCError<string, string>).code).toBe("BAD_REQUEST");
    }
  });
});
