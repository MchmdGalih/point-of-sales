import { OrderStatus, PaymentStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const getTodaySummaryRepository = async (
  startOfDay: Date,
  endOfDay: Date,
  totalCustomers: any,
) => {
  const [
    totalOrders,
    revenueResult,
    paidOrders,
    pendingPayment,
    totalProducts,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        deletedAt: null,
      },
    }),

    prisma.order.aggregate({
      where: {
        status: OrderStatus?.COMPLETED,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        deletedAt: null,
      },
      _sum: { totalAmount: true },
    }),

    prisma.payment.count({
      where: {
        status: PaymentStatus?.PAID,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),

    prisma.payment.count({
      where: {
        status: PaymentStatus?.PENDING,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),

    prisma.product.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.product.count({
      where: {
        deletedAt: null,
        stock: {
          lte: 5,
        },
      },
    }),
  ]);

  return {
    totalOrders,
    revenue: revenueResult._sum.totalAmount,
    paidOrders,
    pendingPayment,
    totalProducts,
    lowStockProducts,
  };
};
