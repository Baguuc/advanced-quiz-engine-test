import express, { type Express } from "express";
import cors from "cors";
import usersRouter from "./modules/users/users.router.ts";
import { errorHandler } from "./util/error.ts";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);

app.use(errorHandler);

console.log("Server starting @ port 3000.");
app.listen(3000);
