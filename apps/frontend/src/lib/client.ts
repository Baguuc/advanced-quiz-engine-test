import { RPCLink } from "@orpc/client/fetch";
import { createORPCClient } from "@orpc/client";
import type { RouterClientType } from "backend";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const link = new RPCLink({
  origin: "http://127.0.0.1:3000",
  url: "/rpc",
});

export const client: RouterClientType = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
