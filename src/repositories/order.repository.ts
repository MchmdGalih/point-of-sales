import type { OrderStatus, Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type { OrderResponse, RepoQueryOrder } from "../model/order-model";

export const getAllOrderRepository = async (
  query: RepoQueryOrder,
): Promise<{ orders: OrderResponse[]; totalData: number }> => {
  const { take, skip, search, status, orderNumber } = query;

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
      take,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
    })),
    totalData,
  };
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

export const deleteOrderRepository = (id: string) => {
  return prisma.order.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
