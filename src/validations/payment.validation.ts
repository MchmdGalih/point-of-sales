import { z } from "zod";
import { PaymentMethod } from "../../generated/prisma/enums";

export const paramsSchema = z.object({
  orderId: z.string({
    message: "Order id is required",
  }),
});

export const paymentSchema = z.object({
  method: z.nativeEnum(PaymentMethod),
  amount: z.number().min(1).optional(),
});
