import type { Role } from "../../generated/prisma/enums";

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
}
