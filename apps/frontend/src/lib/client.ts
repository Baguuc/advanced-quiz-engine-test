import { RPCLink } from "@orpc/client/fetch";
import { createORPCClient } from "@orpc/client";
import type { RouterClientType } from "backend";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const env = import.meta.env;

const link = new RPCLink({
  origin: env.VITE_API_URL,
  url: env.VITE_RPC_PATH,
  fetch: (url, init) => {
    return globalThis.fetch(url, {
      ...init,
      credentials: "include",
    });
  },
});

export const client: RouterClientType = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
