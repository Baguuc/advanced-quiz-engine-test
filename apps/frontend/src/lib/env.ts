import { ltrim } from "./utils";

const getEnvConfig = () => {
    const env = import.meta.env;

    return {
        apiUrl: env.VITE_API_URL,
        authPath: ltrim(env.VITE_AUTH_PATH, '/'),
        rpcPath: ltrim(env.VITE_RPC_PATH, '/')
    };
}

export { getEnvConfig };