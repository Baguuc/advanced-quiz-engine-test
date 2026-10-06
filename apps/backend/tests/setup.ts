import { afterAll, beforeEach } from "vitest";
import { db, pool } from "../src/db/db.ts";
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

if (!process.env.DATABASE_URL?.includes("quiz-engine-test")) {
  throw new Error(`Refusing to run tests against: ${process.env.DATABASE_URL}`);
}

beforeEach(async () => {
  await db.delete(verification);
  await db.delete(answerOption);
  await db.delete(answer);
  await db.delete(questionOption);
  await db.delete(question);
  await db.delete(formAccess);
  await db.delete(response);
  await db.delete(form);
  await db.delete(account);
  await db.delete(session);
  await db.delete(user);
});

afterAll(async () => {
  await pool.end();
});
