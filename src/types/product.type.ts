import type { PaginationResponse } from "../types/pagination";

export interface ProductResponse {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
  category: {
    id: string;
    name: string;
  };
}

export interface ProductQueryRepo {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: "LOW" | "OUT_OF_STOCK" | "AVAILABLE";
  categoryId?: string;
  take: number;
  skip: number;
}

export interface ListProductResponse extends PaginationResponse<ProductResponse> {}
