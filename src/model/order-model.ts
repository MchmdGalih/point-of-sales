import type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "../../generated/prisma/enums";
import type { PaginationResponse } from "./paginations";

export type OrderResponse = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  customerName?: string | null;
  cashier: {
    id: string;
    username: string;
  };
  status: OrderStatus;
  itemsCount: number;
  createdAt: Date;
};

export type OrderItems = {
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
  };
  subtotal: number;
};

export type OrderDetailResponse = Omit<OrderResponse, "itemsCount"> & {
  orderItems: OrderItems[];
  payment?: {
    id: string;
    method: PaymentMethod;
    status: PaymentStatus;
    paymentNumber: string;
    amount: number;
    paidAt: Date | null;
  } | null;

  createdAt: Date;
  updatedAt: Date;
};

export type OrderQueryRequest = {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  orderNumber?: string;
};

export type RepoQueryOrder = OrderQueryRequest & {
  take: number;
  skip: number;
};

export type ListOrder = PaginationResponse<OrderResponse>;
