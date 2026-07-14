import type { PaymentMethod } from "../../generated/prisma/enums";

export interface CreatePaymentDTO {
  method: PaymentMethod;
  amount?: number;
}
