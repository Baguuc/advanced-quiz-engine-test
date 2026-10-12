import { describe, it, assert } from "vitest";
import { call } from "@orpc/server";
import { form } from "../../../src/db/schema.ts";
import { db } from "../../../src/db/db.ts";
import { router } from "../../../src/routes/index.ts";
import { createTestUser } from "../../lib/auth.ts";
import { generateRandomFormData } from "../../lib/form.ts";

/*
### Edge case'y
1. poprawnie tworzy ankiete
2. zwraca poprawny url
3. OwnerId nie istnieje
4. Niepoprawny question type
5. Niepoprawny form visibility
6. niepoprawny status
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

    console.log("Result: ", result);

    // sprawdź czy zwrócony url  
    assert(result.startsWith("/"));
    const splitted = result.split("/");
    assert(splitted.length === 3);
    assert(splitted[1] === "form");
    assert(Number(splitted[2]));
  })
});
