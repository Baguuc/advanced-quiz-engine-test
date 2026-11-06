import { ORPCError, os } from "@orpc/server";
import type { RequestHeadersHandlerPluginContext } from "@orpc/server/plugins";
import { auth } from "./auth.ts";

type ServerContext = RequestHeadersHandlerPluginContext;

export const base = os.$context<ServerContext>();

const requireSession = base.middleware(async ({ context, next }) => {
  const session = await auth.api.getSession({
    headers: context.reqHeaders ?? new Headers(),
  });

  if (!session) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({ context: { session } });
});

export const protectedProcedure = base.use(requireSession);

const optionalSession = base.middleware(async ({ context, next }) => {
  const session = await auth.api.getSession({
    headers: context.reqHeaders ?? new Headers(),
  });

  return next({ context: { session } });
});

export const sessionOptionalProcedure = base.use(optionalSession);
