import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export const UserResponseSchema = UserSchema;

export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
