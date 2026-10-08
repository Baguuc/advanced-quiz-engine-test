import { describe, expect, it } from "vitest";
import { createAuthClient } from "better-auth/client";
import { call, isDefinedError, safe, type ORPCErrorFromErrorMap } from "@orpc/server";
import { createForm } from "../../../src/routes/forms.ts";
import { faker } from '@faker-js/faker';
import { form, form_status, form_visibility, question_type } from "../../../src/db/schema.ts";
import { assert } from "console";
import { db } from "../../../src/db/db.ts";

/*
### Edge case'y
1. poprawnie tworzy ankiete
2. OwnerId nie istnieje
3. Niepoprawny question type
4. Niepoprawny form visibility
5. niepoprawny status
*/

const generateRandomFormData = (userId: number) => {
  const questions = [];
  for(let i =  0; i < 5; i++) {
    questions.push({
      type: "single_choice" as any,
      title: faker.string.sample(16),
      description: faker.string.sample(64),
      position: i,
      required: faker.datatype.boolean(),
      config: {}
    })
  }

  const data = {
    ownerId: userId,
    title: faker.string.sample(16),
    description: faker.string.sample(64),
    status: faker.helpers.arrayElement([ form_status.enumValues ]) as any,
    visibility: faker.helpers.arrayElement([ form_visibility.enumValues ]) as any,
    allowAnonymous: faker.datatype.boolean(),
    allowMultipleResponses: faker.datatype.boolean(),
    questions: questions
  }

  return data;
}

describe("testing form creation", () => {
  it("successfully creates a form", async () => {
    /* inicjalizuj testowego użytkownika */
    const authClient = createAuthClient({
        baseURL: "http://localhost:3000/auth",
    });

    const authResult = await authClient.signUp.email({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    if (authResult.error) {
      throw new Error("unknown error")
    }

    const userId = Number(authResult.data.user.id);
    const data = generateRandomFormData(userId);

    await call(createForm, data)

    const forms = await db.select().from(form);
    assert(forms.length == 1)
  })
});
