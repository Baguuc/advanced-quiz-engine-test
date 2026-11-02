import { createAuthClient } from "better-auth/react";
import { getEnvConfig } from "./env";

const config = getEnvConfig();

export const authClient = createAuthClient({
  baseURL: `${config.apiUrl}/${config.authPath}`
});
