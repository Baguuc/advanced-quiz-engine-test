import { describe, expect, it } from "vitest";
import {
  account,
  answer,
  answerOption,
  form,
  formAccess,
  question,
  questionOption,
  response,
  session,
  user,
  verification,
} from "../src/db/schema.ts";
import { db, pool } from "../src/db/db.ts";

describe("testing suite", () => {
  it("starts with an empty database", async () => {
    const tables = [
      answerOption,
      answer,
      questionOption,
      question,
      formAccess,
      response,
      form,
      account,
      session,
      user,
      verification,
    ];

    for (const table of tables) {
      const result = await db.select().from(table).limit(1);
      expect(result).toEqual([]);
    }
  });

  it("is connected to the testing database", async () => {
    const result = await pool.query("SELECT current_database()");
    expect(result.rows[0]).toHaveProperty("current_database", "quiz-engine-test");
  });
});
