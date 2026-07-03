import type { OrderStatus, Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type { RepoQueryOrder } from "../model/order-model";

export const getAllOrderRepository = async (query?: RepoQueryOrder) => {
  const { limit = 10, skip = 0, search, status, orderNumber } = query || {};

  const where = {
    deletedAt: null,

    ...(search && {
      user: {
        username: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
    }),
    ...(orderNumber && {
      orderNumber: {
        contains: orderNumber,
        mode: "insensitive" as const,
      },
    }),
    ...(status && { status: status as OrderStatus }),
  };

  const [orders, totalData] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, username: true },
        },
        _count: {
          select: { orderItem: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    totalData,
  };
};

export const createOrderRepository = async (
  payload: Prisma.OrderUncheckedCreateInput,
) => {
  return await prisma.order.create({
    data: payload,
    include: {
      orderItem: true,
      user: {
        select: { id: true, username: true },
      },
    },
  });
};

export const getOrderByIdRepository = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id, deletedAt: null },
    include: {
      user: {
        select: { id: true, username: true },
      },
      orderItem: true,
      payment: true,
    },
  });
};

export const getOrderByOrderNumberRepository = (orderNumber: string) => {
  return prisma.order.findFirst({
    where: { orderNumber, deletedAt: null },
    include: { orderItem: true, payment: true },
  });
};

export const updateOrderStatusRepository = (
  tx: Prisma.TransactionClient,
  id: string,
  status: OrderStatus,
) => {
  return tx.order.update({
    where: { id, deletedAt: null },
    data: { status },
  });
};

export const deleteOrderRepository = (id: string): Promise<any> => {
  return prisma.order.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
