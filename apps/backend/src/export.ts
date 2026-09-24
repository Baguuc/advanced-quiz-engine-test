import { router } from "./routes/index.ts";
import type { RouterClient } from "@orpc/server";

export type RouterClientType = RouterClient<typeof router>;
