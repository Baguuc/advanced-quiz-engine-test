import { RPCLink } from "@orpc/client/fetch";
import { createORPCClient } from "@orpc/client";
import type { RouterClientType } from "backend";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { getEnvConfig } from "./env";

const config = getEnvConfig();

const link = new RPCLink({
  origin: config.apiUrl,
  url: `/${config.rpcPath}`,
  fetch: (url, init) => {
    return globalThis.fetch(url, {
      ...init,
      credentials: "include",
    });
  },
});

export const client: RouterClientType = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
