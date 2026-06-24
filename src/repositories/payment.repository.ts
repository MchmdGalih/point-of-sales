import type {
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "../../generated/prisma/client";
import type { RepoQueryPayment } from "../dto/payment.dto";
import { prisma } from "../lib/prisma";
import type { PaymentResponse } from "../model/payment-model";

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

export const createPaymentRepository = async (
  payload: Prisma.PaymentUncheckedCreateInput,
): Promise<PaymentResponse> => {
  const payment = await prisma.payment.create({ data: payload });
  return {
    ...payment,
    amount: payment.amount.toNumber(),
  };
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
