import { OrderStatus, type Prisma } from "../../generated/prisma/client";
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

export const countOrderByDateRange = (startDate: Date, endDate: Date) => {
  return prisma.order.count({
    where: {
      deletedAt: null,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
};

export const countPendingOrdersByDateRange = (
  startDate: Date,
  endDate: Date,
) => {
  return prisma.order.count({
    where: {
      deletedAt: null,
      status: OrderStatus.PENDING,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
};

export const getDistinctCustomerByDateRange = (
  startDate: Date,
  endDate: Date,
) => {
  return prisma.order.findMany({
    where: {
      deletedAt: null,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      customerName: true,
    },
    distinct: ["customerName"],
  });
};

export const getRecentOrdersRepository = () => {
  return prisma.order.findMany({
    where: {
      deletedAt: null,
    },

    include: {
      _count: {
        select: { orderItem: true },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
};

export const getSalesTrendRepository = (startOfDate: Date, endOfDate: Date) => {
  return prisma.$queryRaw`
    SELECT DATE("createdAt") as date,
    COUNT("id")::int as "totalOrders",
    SUM("totalAmount")::int as "revenue"
    FROM "Order"
    WHERE "createdAt" >= ${startOfDate} AND  "createdAt" <= ${endOfDate} AND "deletedAt" IS NULL AND "status" = 'COMPLETED'
    GROUP BY DATE("createdAt")
    ORDER BY date asc 
    `;
};
