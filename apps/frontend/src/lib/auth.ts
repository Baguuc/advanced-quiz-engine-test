import { createAuthClient } from "better-auth/react";
import { ltrim } from "./utils";

const env = import.meta.env;

export const authClient = createAuthClient({
  baseURL: `${env.VITE_API_URL}/${ltrim(env.VITE_AUTH_PATH, '/')}`,
});
