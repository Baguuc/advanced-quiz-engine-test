import { describe, it } from "vitest";
import { call } from "@orpc/server";
import { faker } from '@faker-js/faker';
import { form, form_status, form_visibility } from "../../../src/db/schema.ts";
import { assert } from "console";
import { db } from "../../../src/db/db.ts";
import { router } from "../../../src/routes/index.ts";
import { createTestUser } from "../../lib/auth.ts";
import { generateRandomFormData } from "../../lib/form.ts";

/*
### Edge case'y
1. poprawnie tworzy ankiete
2. OwnerId nie istnieje
3. Niepoprawny question type
4. Niepoprawny form visibility
5. niepoprawny status
*/

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
    assert(forms.length == 1)
  })
});
