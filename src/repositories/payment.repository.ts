import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const getAllPaymentRepository = () => {
  return prisma.payment.findMany();
};

export const createPaymentRepository = (
  payload: Prisma.PaymentUncheckedCreateInput,
) => {
  return prisma.payment.create({ data: payload });
};
