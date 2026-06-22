import type { PaymentMethod } from "../../generated/prisma/enums";

export interface PaymentQueryDTO {
  page?: number;
  limit?: number;
  paymentNumber?: string;
  status?: string;
  orderId?: string;
  method?: string;
}

export interface RepoQueryPayment {
  take: number;
  skip: number;
  paymentNumber?: string;
  status?: string;
  orderId?: string;
  method?: string;
}
