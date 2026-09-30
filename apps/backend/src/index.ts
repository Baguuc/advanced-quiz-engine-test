import { RPCHandler } from "@orpc/server/node";
import { router } from "./routes/index.ts";
import express from "express";
import cors from "cors";
import { onError } from "@orpc/server";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.ts";
import { RequestHeadersHandlerPlugin } from "@orpc/server/plugins";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.all("/auth/*splat", toNodeHandler(auth));

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.log(error);
    }),
  ],
  plugins: [new RequestHeadersHandlerPlugin()],
});

app.use("/rpc/{*path}", async (req, res, next) => {
  const { matched } = await handler.handle(req, res, {
    prefix: "/rpc",
  });

  if (matched) {
    return;
  }

  next();
});

app.listen(3000, () => console.log("Server listening on port 3000"));
