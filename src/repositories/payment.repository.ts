import type {
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type { RepoQueryPayment } from "../model/payment-model";

export const getAllPaymentRepository = async (query: RepoQueryPayment) => {
  const { skip, paymentNumber, take, method, status, orderId } = query;

  const where = {
    ...(paymentNumber && {
      paymentNumber: {
        contains: paymentNumber,
        mode: "insensitive" as const,
      },
    }),
    ...(status && { status: status as PaymentStatus }),
    ...(method && { method: method as PaymentMethod }),
    ...(orderId && { orderId }),
  };
  const [payments, totalData] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.payment.count({ where }),
  ]);
  return {
    payments,
    totalData,
  };
};

export const createPaymentRepository = (
  payload: Prisma.PaymentUncheckedCreateInput,
) => {
  return prisma.payment.create({ data: payload });
};

export const getPaymentByIdRepository = (id: string) => {
  return prisma.payment.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          orderItem: true,
        },
      },
    },
  });
};

export const updatePaymentByOrderIdRepository = (
  tx: Prisma.TransactionClient,
  orderId: string,
  payload: {
    status: PaymentStatus;
    provider?: string;
    providerTransactionId?: string;
    providerPaymentType?: string;
    paidAt?: Date | null;
  },
) => {
  return tx.payment.update({ where: { orderId }, data: payload });
};
