import type {
  OrderItem,
  OrderStatus,
  Prisma,
} from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type {
  CreateOrderResponse,
  OrderDetailResponse,
  OrderItems,
  OrderResponse,
  RepoQueryOrder,
} from "../model/order-model";

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
    orders: orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      cashier: {
        id: order.user?.id as string,
        username: order.user?.username as string,
      },
      status: order.status,
      itemsCount: order._count.orderItem,
      totalAmount: order.totalAmount.toNumber(),
      createdAt: order.createdAt,
    })),
    totalData,
  };
};

export const createOrderRepository = async (
  payload: Prisma.OrderUncheckedCreateInput,
): Promise<CreateOrderResponse> => {
  const newOrder = await prisma.order.create({
    data: payload,
    include: {
      orderItem: true,
      user: {
        select: { id: true, username: true },
      },
    },
  });

  return {
    id: newOrder.id,
    orderNumber: newOrder.orderNumber,
    status: newOrder.status,
    totalAmount: newOrder.totalAmount.toNumber(),
    customerName: newOrder.customerName,
    cashier: {
      id: newOrder.user?.id as string,
      username: newOrder.user?.username as string,
    },
    items: newOrder.orderItem.map((item: OrderItem) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price.toNumber(),
      subtotal: item.subtotal.toNumber(),
    })),
    createdAt: newOrder.createdAt,
  };
};

export const getOrderByIdRepository = async (
  id: string,
): Promise<OrderDetailResponse | null> => {
  const order = await prisma.order.findUnique({
    where: { id, deletedAt: null },
    include: {
      user: {
        select: { id: true, username: true },
      },
      orderItem: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
      payment: true,
    },
  });

  if (!order) return null;

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    totalAmount: order.totalAmount.toNumber(),
    customerName: order.customerName,
    cashier: {
      id: order.user?.id as string,
      username: order.user?.username as string,
    },
    orderItems: order.orderItem.map((item: OrderItem) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price.toNumber(),
      subtotal: item.subtotal.toNumber(),
    })),
    payment: order.payment
      ? {
          id: order.payment.id,
          paymentNumber: order.payment.paymentNumber,
          status: order.payment.status,
          amount: order.payment.amount.toNumber(),
          paidAt: order.payment.paidAt,
          method: order.payment.method,
        }
      : null,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
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
