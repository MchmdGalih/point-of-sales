import { z } from "zod";
import { PaymentMethod } from "../../generated/prisma/enums";

export const paymentSchema = z.object({
  orderId: z.string().min(1),
  method: z.nativeEnum(PaymentMethod),
});
