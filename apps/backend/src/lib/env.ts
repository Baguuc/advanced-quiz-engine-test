import "dotenv/config";

function removeLeadingChar(str: string, char: string) {
  while (str.startsWith(char)) {
    str = str.slice(char.length);
  }
  return str;
}

export const getEnvConfig = () => {
  return {
    appPort: process.env.APP_PORT!,
    baseUrl: process.env.APP_BASE_URL!,
    corsTrustedOrigin: process.env.CORS_TRUSTED_ORIGIN!,
    databaseUrl: process.env.DATABASE_URL!,
    betterAuthPath: removeLeadingChar(process.env.BETTER_AUTH_PATH!, "/"),
    betterAuthSecret: process.env.BETTER_AUTH_SECRET!,
    orpcPath: removeLeadingChar(process.env.ORPC_PATH!, "/"),
  };
};
