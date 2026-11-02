import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./relations.ts";
import { Pool } from "pg";
import { getEnvConfig } from "../lib/env.ts";

const config = getEnvConfig();

export const pool = new Pool({
  connectionString: config.databaseUrl,
});

export const db = drizzle({ relations, client: pool });
