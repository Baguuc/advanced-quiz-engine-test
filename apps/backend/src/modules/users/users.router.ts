import { Router } from "express";
import usersController from "./users.controller.ts";

const usersRouter = Router();

usersRouter.get("/", usersController.getUsers);
usersRouter.post("/", usersController.createUsers);

export default usersRouter;
