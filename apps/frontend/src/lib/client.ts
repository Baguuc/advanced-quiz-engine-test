import { RPCLink } from "@orpc/client/fetch";
import { createORPCClient } from "@orpc/client";
import type { RouterClientType } from "backend";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const link = new RPCLink({
  origin: "http://localhost:3000",
  url: "/rpc",
  fetch: (url, init) => {
    return globalThis.fetch(url, {
      ...init,
      credentials: "include",
    });
  },
});

export const client: RouterClientType = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
