import { z } from "zod";
import { Role } from "../../generated/prisma/enums";

export const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
});

export const updateUserSchema = createUserSchema.partial();
