import type { PaginationResponse } from "./paginations";

export type ProductResponse = {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
  category: {
    id: string;
    name: string;
  };
};

export type ProductQueryRepo = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: "LOW" | "OUT_OF_STOCK" | "AVAILABLE";
  categoryId?: string;
  take: number;
  skip: number;
};

export type ListProductResponse = PaginationResponse<ProductResponse>;
