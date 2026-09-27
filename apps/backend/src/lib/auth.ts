import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db.ts";
import * as schema from "../db/schema.ts";
import { i18n, locales } from "@better-auth/i18n";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: "serial",
    },
  },
  baseURL: "http://localhost:3000/auth",
  trustedOrigins: ["http://localhost:5173"],
  plugins: [
    i18n({
      translations: {
        pl: locales.pl,
      }
    })
  ]
});
