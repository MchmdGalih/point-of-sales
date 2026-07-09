import { z } from "zod";
import { PaymentMethod, PaymentStatus } from "../../generated/prisma/enums";
import { paginationSchema } from "./pagination.validation";

export const paymentQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  status: z.nativeEnum(PaymentStatus).optional(),
  method: z.nativeEnum(PaymentMethod).optional(),
});

export type PaymentQueryRequest = z.infer<typeof paymentQuerySchema>;

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
