/* eslint-disable @typescript-eslint/require-await */
import type { CreateUserInput, User } from "@aqe/common/api/contracts/users";

export default {
  getUsers: async (): Promise<User[]> => {
    return [
      { id: "1", name: "John Doe", email: "john.doe@example.com" },
      { id: "2", name: "Jane Smith", email: "jane.smith@example.com" },
    ];
  },

  create: async (userData: CreateUserInput): Promise<User> => {
    return {
      id: "1",
      name: userData.name,
      email: userData.email,
    };
  },
};
