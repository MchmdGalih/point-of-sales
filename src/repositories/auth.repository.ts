import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const registerRepository = async (payload: Prisma.UserCreateInput) => {
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

export const logoutRepository = async (id: string) => {
  console.log(id);
  await prisma.session.delete({
    where: {
      id,
    },
  });
};
