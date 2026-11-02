// eslint-disable-next-line @typescript-eslint/no-unused-vars
import "dotenv/config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import dotenv from "dotenv";
import { ltrim } from "./utils.ts";

const getEnvConfig = () => {
  return {
    appPort: process.env.APP_PORT!,
    baseUrl: process.env.BASE_URL!,
    corsTrustedOrigin: process.env.CORS_TRUSTED_ORIGIN!,
    databaseUrl: process.env.DATABASE_URL!,
    betterAuthPath: ltrim(process.env.BETTER_AUTH_PATH!, "/"),
    betterAuthSecret: process.env.BETTER_AUTH_SECRET!,
    orpcPath: ltrim(process.env.ORPC_PATH!, "/"),
  };
};

export { getEnvConfig };
