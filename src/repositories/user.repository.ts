import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type { UserQueryRepository, UserResponse } from "../model/user-model";

export const getAllUserRepository = async (
  query: UserQueryRepository,
): Promise<{ users: UserResponse[]; totalData: number }> => {
  const { take, skip, search, role } = query;

  const where = {
    deletedAt: null,
    ...(role && { role }),
    ...(search && {
      username: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),
  };

  const [users, totalData] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      omit: {
        password: true,
      },
      include: {
        order: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count({
      where,
    }),
  ]);

  return {
    users,
    totalData,
  };
};

export const userFindExistingRepository = (username: string, email: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
      deletedAt: null,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      password: true,
    },
  });
};

export const createUserRepository = (
  payload: Prisma.UserCreateInput,
): Promise<UserResponse> => {
  return prisma.user.create({
    data: payload,
    omit: {
      password: true,
    },
  });
};

export const getUserByIdRepository = (
  id: string,
): Promise<UserResponse | null> => {
  return prisma.user.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    omit: {
      password: true,
    },
  });
};

export const updateUserRepository = (
  id: string,
  payload: Prisma.UserUpdateInput,
): Promise<UserResponse> => {
  return prisma.user.update({
    where: {
      id,
      deletedAt: null,
    },
    data: payload as object,
    omit: {
      password: true,
    },
  });
};

export const deleteUserRepository = (id: string): Promise<UserResponse> => {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
