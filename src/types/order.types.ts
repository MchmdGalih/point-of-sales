import type { OrderStatus } from "../../generated/prisma/enums";
import type { PaginationResponse } from "../types/pagination";
import type { PaymentResponse } from "../types/payment.type";

export interface OrderResponse {
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
}

export interface ItemOrder {
  productId: string;
  quantity: number;
}

export interface OrderItems {
  productId: string;
  quantity: number;
  price: number;
  productName: string;
  subtotal: number;
}

export interface CreateOrderResponse extends Omit<OrderResponse, "itemsCount"> {
  items: Omit<OrderItems, "product">[];
}
export interface OrderDetailResponse extends Omit<OrderResponse, "itemsCount"> {
  orderItems: OrderItems[];
  payment?: PaymentResponse | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RepoQueryOrder {
  take: number;
  skip: number;
  search?: string;
  status?: OrderStatus;
}

export type ListOrderResponse = PaginationResponse<OrderResponse>;
