import type { PaymentStatus, Prisma } from "../../generated/prisma/client";
import type { PaymentQueryDTO } from "../dto/payment.dto";
import { prisma } from "../lib/prisma";

export const getAllPaymentRepository = async (query: PaymentQueryDTO) => {
  const { page = 1, limit = 10, paymentMethod, status, orderId } = query;
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status: status as PaymentStatus }),
    ...(paymentMethod && { paymentMethod }),
    ...(orderId && { orderId }),
  };

  const [payments, totalData] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    payments,
    pagination: {
      page,
      limit,
      totalData,
      totalPage: Math.ceil(totalData / limit),
    },
  };
};

export const createPaymentRepository = (
  payload: Prisma.PaymentUncheckedCreateInput,
) => {
  return prisma.payment.create({ data: payload });
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
