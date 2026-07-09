import type { OrderStatus } from "../../generated/prisma/enums";
import type { PaginationResponse } from "./paginations";
import type { PaymentResponse } from "./payment-model";

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

export interface ItemOrder {
  productId: string;
  quantity: number;
}

export type OrderItems = {
  productId: string;
  quantity: number;
  price: number;
  productName: string;
  subtotal: number;
};

export type CreateOrderResponse = Omit<OrderResponse, "itemsCount"> & {
  items: Omit<OrderItems, "product">[];
};
export type OrderDetailResponse = Omit<OrderResponse, "itemsCount"> & {
  orderItems: OrderItems[];
  payment?: PaymentResponse | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RepoQueryOrder = {
  take: number;
  skip: number;
  search?: string;
  status?: OrderStatus;
};

export type ListOrderResponse = PaginationResponse<OrderResponse>;
