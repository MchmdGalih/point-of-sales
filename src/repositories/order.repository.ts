import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type { CreateOrderPayload } from "../validations/order.validation";

export const getAllOrderRepository = () => {
  return prisma.order.findMany({ where: { deletedAt: null } });
};

export const createOrderRepository = (
  payload: Prisma.OrderUncheckedCreateInput,
) => {
  return prisma.order.create({
    data: payload,
    include: { orderItem: true, payment: true },
  });
};
