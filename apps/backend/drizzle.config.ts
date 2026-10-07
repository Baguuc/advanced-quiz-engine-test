import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/db/schema.ts", "./src/db/auth-schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
