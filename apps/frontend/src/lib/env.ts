import { ltrim } from "./utils";

export function getEnvConfig() {
  const env = import.meta.env;

  return {
    apiUrl: env.VITE_API_URL as string,
    authPath: ltrim(env.VITE_AUTH_PATH as string, "/"),
    rpcPath: ltrim(env.VITE_RPC_PATH as string, "/"),
  };
}
