import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type { UserResponse } from "../model/user-model";

export const registerRepository = async (
  payload: Prisma.UserCreateInput,
): Promise<UserResponse> => {
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

export const logoutRepository = async (id: string): Promise<void> => {
  await prisma.user.update({
    where: {
      id,
      deletedAt: null,
    },
    data: {
      token: null,
    },
  });
};
