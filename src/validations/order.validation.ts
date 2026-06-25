import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().min(3),
  orderItems: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().min(1),
    }),
  ),
});

export type CreateOrderPayload = z.infer<typeof orderSchema>;
