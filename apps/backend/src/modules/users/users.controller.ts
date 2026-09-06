import { CreateUserSchema } from "@aqe/common/api/contracts/users";
import usersService from "./users.service.ts";
import type { Request, Response } from "express";

export default {
  getUsers: async (_req: Request, res: Response) => {
    res.status(200).json(await usersService.getUsers());
  },

  createUsers: async (req: Request, res: Response) => {
    const input = CreateUserSchema.parse(req.body);

    const user = await usersService.create(input);

    res.status(201).json(user);
  },
};
