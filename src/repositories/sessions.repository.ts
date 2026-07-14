import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const createSessionRepository = (
  payload: Prisma.SessionUncheckedCreateInput,
) => {
  return prisma.session.create({ data: payload });
};

export const findSessionByRefreshTokenRepository = (refreshToken: string) => {
  return prisma.session.findUnique({
    where: { refreshToken },
    include: { user: true },
  });
};

export const updateSessionByIdRepository = (
  id: string,
  payload: Prisma.SessionUncheckedUpdateInput,
) => {
  return prisma.session.update({ where: { id }, data: payload });
};
