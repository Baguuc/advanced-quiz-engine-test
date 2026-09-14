import { RPCHandler } from "@orpc/server/node";
import { router } from "./routes/index.ts";
import express from "express";
import cors from "cors";
import { onError } from "@orpc/server";

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

// TODO: better-auth
// app.all("/auth/*splat", toNodeHandler(auth));

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.log(error);
    }),
  ],
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
