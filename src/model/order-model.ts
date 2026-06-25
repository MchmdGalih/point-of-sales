import type { OrderStatus } from "../../generated/prisma/enums";
import type { PaginationResponse } from "./paginations";

export type OrderResponse = {
  id: string;
  orderNumber: string;
  userId: string;
  totalAmount: number;
  customerName?: string | null;
  status: OrderStatus;
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
