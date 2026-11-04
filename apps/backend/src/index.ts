import { RPCHandler } from "@orpc/server/node";
import { router } from "./routes/index.ts";
import express from "express";
import cors from "cors";
import { onError } from "@orpc/server";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.ts";
import { RequestHeadersHandlerPlugin } from "@orpc/server/plugins";
import { getEnvConfig } from "./lib/env.ts";

const app = express();
const config = getEnvConfig();

app.use(
  cors({
    origin: config.corsTrustedOrigin,
    credentials: true,
  }),
);

app.all(`/${config.betterAuthPath}/*splat`, toNodeHandler(auth));

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.log(error);
    }),
  ],
  plugins: [new RequestHeadersHandlerPlugin()],
});

app.use(`/${config.orpcPath}/{*path}`, async (req, res, next) => {
  const { matched } = await handler.handle(req, res, {
    prefix: `/${config.orpcPath}`,
  });

  if (matched) {
    return;
  }

  next();
});

app.listen(3000, () => console.log("Server listening on port 3000"));
