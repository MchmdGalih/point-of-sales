import { z } from "zod";
import { Role } from "../../generated/prisma/enums";
import { paginationSchema } from "./pagination.validation";

export const userQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  role: z.nativeEnum(Role).optional(),
});

export type UserQueryRequest = z.infer<typeof userQuerySchema>;

export const createUserSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.nativeEnum(Role).optional(),
});

export const updateUserSchema = createUserSchema.partial();
