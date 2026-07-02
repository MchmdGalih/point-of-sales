import type {
  PaymentMethod,
  PaymentStatus,
} from "../../generated/prisma/enums";
import type { OrderItems } from "./order-model";
import type { PaginationResponse } from "./paginations";

export type PaymentResponse = {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  provider?: string | null;
  paymentNumber: string;
  amount: number;
  change?: number | null;
  providerTransactionId?: string | null;
  providerPaymentType?: string | null;
  snapToken: string | null;
  paidAt: Date;
};

export type CashPaymentResponse = {
  id: string;
  paymentNumber: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  change?: number | null;
  paidAt: Date;
  order: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    customerName?: string | null;
    cashier: {
      id: string;
      username: string;
    };
    orderItems: OrderItems[];
  };
};

export type MidtransPaymentResponse = {
  snapToken: string;
  redirectUrl: string;
};

export type CreatePaymentResponse =
  | CashPaymentResponse
  | MidtransPaymentResponse;

export type PaymentQueryRequest = {
  page?: number;
  limit?: number;
  paymentNumber?: string;
  status?: PaymentStatus;
  orderId?: string;
  method?: PaymentMethod;
};

export type PaymentDetailResponse = {
  id: string;
  paymentNumber: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  paidAt: Date;
  provider?: string | null;
  snapToken?: string | null;
  providerTransactionId?: string | null;
  order: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    customerName: string;
    cashier: {
      id: string;
      username: string;
    };
  };
  orderItems: [
    {
      productId: string;
      productName: string;
      quantity: number;
      price: number;
      subtotal: number;
    },
  ];
};

export type RepoQueryPayment = PaymentQueryRequest & {
  take: number;
  skip: number;
};

export type ListPaymentResponse = PaginationResponse<PaymentResponse>;
