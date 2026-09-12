import { RPCHandler } from "@orpc/server/node";
import { createServer } from "node:http";
import { router } from "./routes/index.ts";
import { CORSHandlerPlugin } from "@orpc/server/plugins";

const handler = new RPCHandler(router, {
  plugins: [
    new CORSHandlerPlugin({
      origin: "*",
    }),
  ],
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = createServer(async (req, res) => {
  const { matched } = await handler.handle(req, res, { prefix: "/rpc" });

  if (!matched) {
    return;
  }

  res.statusCode = 404;
  res.end("Not found");
});

server.listen(3000, "127.0.0.1", () => console.log("Listening on 127.0.0.1:3000"));
