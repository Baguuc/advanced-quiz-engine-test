import express, { type Express } from "express";
import cors from "cors";
import usersRouter from "./modules/users/users.router.ts";

const app: Express = express();

app.use(cors());

app.use("/users", usersRouter);

console.log("Server starting @ port 3000.");
app.listen(3000);
