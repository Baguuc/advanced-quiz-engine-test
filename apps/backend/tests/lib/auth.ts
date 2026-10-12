import { faker } from "@faker-js/faker";
import { auth } from "../../src/lib/auth.ts";

const createTestUser = async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    await auth.api.signUpEmail({
      body: {
        name: faker.person.fullName(),
        email,
        password,
      }
    });

    const { response, headers } = await auth.api.signInEmail({
        body: { email, password },
        returnHeaders: true
    })

    const setCookies = headers.getSetCookie();
    const sessionCookie = setCookies
        .map((cookie) => cookie.split(";")[0])
        .find((cookie) => cookie.includes("session_token"));

    if (!sessionCookie) {
        throw new Error("Better Auth did not return a session cookie");
    }
    
    return sessionCookie;
}

export { createTestUser };