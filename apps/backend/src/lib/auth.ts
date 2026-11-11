import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db.ts";
import * as schema from "../db/schema.ts";
import { i18n, locales } from "@better-auth/i18n";
import { getEnvConfig } from "./env.ts";

const config = getEnvConfig();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    roblox: {
      clientId: process.env.SOCIAL_ROBLOX_CLIENT_ID as string,
      clientSecret: process.env.SOCIAL_ROBLOX_CLIENT_SECRET as string,
    },
  },
  advanced: {
    database: {
      generateId: "serial",
    },
  },
  baseURL: new URL(config.betterAuthPath, config.baseUrl).href,
  trustedOrigins: [config.corsTrustedOrigin],
  plugins: [
    i18n({
      translations: {
        pl: locales.pl,
      },
    }),
  ],
});
