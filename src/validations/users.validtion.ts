import { z } from "zod";
import { Role } from "../../generated/prisma/enums";

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
