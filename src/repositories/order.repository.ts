import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const getAllOrderRepository = () => {
  return prisma.order.findMany({ where: { deletedAt: null } });
};

export const createOrderRepository = (
  payload: Prisma.OrderUncheckedCreateInput,
) => {
  return prisma.order.create({
    data: payload,
    include: { orderItem: true },
  });
};

export const getOrderByIdRepository = (id: string) => {
  return prisma.order.findUnique({
    where: { id, deletedAt: null },
    include: { orderItem: true, payment: true },
  });
};
