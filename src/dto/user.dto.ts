import { z } from "zod";
import type { Role } from "../../generated/prisma/enums";
import type {
  createUserSchema,
  updateUserSchema,
} from "../validations/users.validtion";

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;

export interface UserQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
}
