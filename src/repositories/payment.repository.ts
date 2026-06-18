import type { PaymentStatus, Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const getAllPaymentRepository = () => {
  return prisma.payment.findMany();
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
