import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./relations.ts";
import { Pool } from "pg";
import { getEnvConfig } from "../lib/env.ts";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const config = getEnvConfig();

export const pool = new Pool({
  connectionString: config.databaseUrl,
});

export const db = drizzle({ relations, client: pool });

export const migrateDatabase = async () => {
  await migrate(db, { migrationsFolder: './drizzle' });
}