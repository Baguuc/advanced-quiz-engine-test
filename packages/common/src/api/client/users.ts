import { api } from "./client.ts";
import type { CreateUserInput, User } from "../contracts/users.ts";

export const usersApi = {
  list: () => api.get<User[]>("/users"),

  create: (input: CreateUserInput) => api.post<User>("/users", input),
};
