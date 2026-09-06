/* eslint-disable @typescript-eslint/require-await */
import type { CreateUserInput, User } from "@aqe/common/api/contracts/users";

export default {
  getUsers: async (): Promise<User[]> => {
    return [];
  },

  create: async (userData: CreateUserInput): Promise<User> => {
    return {
      id: "1",
      name: userData.name,
      email: userData.email,
    };
  },
};
