import { prisma } from "../lib/prisma";

export const getAllOrderRepository = () => {
  return prisma.order.findMany({ where: { deletedAt: null } });
};

export const createOrderRepository = (payload: any) => {
  return prisma.order.create({
    data: payload,
  });
};
