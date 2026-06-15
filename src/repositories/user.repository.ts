import type {
  CreateUserDTO,
  UpdateUserDTO,
  UserQueryDTO,
} from "../dto/user.dto";
import { prisma } from "../lib/prisma";

export const getAllUserRepository = async (query: UserQueryDTO) => {
  const { page = 1, limit = 10, search, role } = query;
  const skip = (page - 1) * limit;

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
      take: limit,

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
    pagination: {
      page,
      limit,
      totalData,
      totalPage: Math.ceil(totalData / limit),
    },
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

export const createUserRepository = (payload: CreateUserDTO) => {
  return prisma.user.create({
    data: payload,
    omit: {
      password: true,
    },
  });
};

export const getUserByIdRepository = (id: string) => {
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

export const updateUserRepository = (id: string, payload: UpdateUserDTO) => {
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

export const deleteUserRepository = (id: string) => {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
