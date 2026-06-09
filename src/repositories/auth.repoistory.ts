import { prisma } from "../lib/prisma";
import type { RegisterDTO } from "../validations/auth.validation";

export const registerRepository = async (payload: RegisterDTO) => {
  return await prisma.user.create({
    data: payload,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};
