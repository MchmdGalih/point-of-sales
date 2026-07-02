import { z } from "zod";
import { PaymentMethod } from "../../generated/prisma/enums";

export const paramsSchema = z.object({
  orderId: z
    .string({
      message: "Order id is required",
    })
    .uuid({ message: "Invalid order id" }),
});

export const paymentSchema = z.object({
  method: z.nativeEnum(PaymentMethod),
  amount: z
    .number({ message: "Amount is required" })
    .min(1, { message: "Amount must be at least 1" })
    .optional(),
});
