import { createAuthClient } from "better-auth/react";

const env = import.meta.env;

export const authClient = createAuthClient({
  baseURL: `${env.VITE_API_URL}/${env.VITE_AUTH_PATH.trimStart('/')}`,
});
