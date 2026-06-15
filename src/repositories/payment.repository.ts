import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const createPaymentRepository = (
  payload: Prisma.PaymentUncheckedCreateInput,
) => {
  return prisma.payment.create({ data: payload });
};
