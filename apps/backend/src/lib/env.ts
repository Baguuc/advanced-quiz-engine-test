import "dotenv/config";
import { ltrim, rtrim } from "./utils.ts";

export const getEnvConfig = () => {
  return {
    appPort: process.env.APP_PORT!,
    baseUrl: rtrim(process.env.APP_BASE_URL!, "/"),
    corsTrustedOrigin: process.env.CORS_TRUSTED_ORIGIN!,
    databaseUrl: process.env.DATABASE_URL!,
    betterAuthPath: ltrim(process.env.BETTER_AUTH_PATH!, "/"),
    betterAuthSecret: process.env.BETTER_AUTH_SECRET!,
    orpcPath: ltrim(process.env.ORPC_PATH!, "/"),
  };
};
