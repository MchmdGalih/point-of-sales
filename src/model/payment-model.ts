import type {
  PaymentMethod,
  PaymentStatus,
} from "../../generated/prisma/enums";
import type { PaginationResponse } from "./paginations";

export type PaymentResponse = {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  provider?: string | null;
  paymentNumber: string;
  amount: number;
  providerTransactionId?: string | null;
  providerPaymentType?: string | null;
  snapToken: string | null;
  paidAt?: Date | null;
};

export type CreatePaymentResponse = {
  snapToken: string | null;
  redirectUrl: string | null;
};

export type PaymentQueryRequest = {
  page?: number;
  limit?: number;
  paymentNumber?: string;
  status?: PaymentStatus;
  orderId?: string;
  method?: PaymentMethod;
};

export type RepoQueryPayment = PaymentQueryRequest & {
  take: number;
  skip: number;
};

export type ListPaymentResponse = PaginationResponse<PaymentResponse>;
