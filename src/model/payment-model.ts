import type {
  PaymentMethod,
  PaymentStatus,
} from "../../generated/prisma/enums";

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
