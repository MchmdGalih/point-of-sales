import type {
  PaymentMethod,
  PaymentStatus,
} from "../../generated/prisma/enums";
import type { OrderItems } from "../types/order.types";
import type { PaginationResponse } from "../types/pagination";

export interface PaymentResponse {
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
  paidAt: Date;
}

export interface CashPaymentResponse {
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
}

export interface MidtransPaymentResponse {
  snapToken: string;
  redirectUrl: string;
}

export type CreatePaymentResponse =
  | CashPaymentResponse
  | MidtransPaymentResponse;

export interface PaymentDetailResponse {
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
}

export interface RepoQueryPayment {
  take: number;
  skip: number;
  search?: string;
  paymentNumber?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
}

export interface ListPaymentResponse extends PaginationResponse<PaymentResponse> {}
