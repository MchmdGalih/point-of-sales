import { z } from "zod";

export const paymentSchema = z.object({
  orderId: z.string().min(1),
  method: z.string().min(1),
});
