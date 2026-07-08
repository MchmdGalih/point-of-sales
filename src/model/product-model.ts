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

export type CreateProductRequest = {
  name: string;
  price: number;
  stock: number;
  sku: string;
  categoryId: string;
};

export type UpdateProductRequest = Partial<Omit<CreateProductRequest, "sku">>;

export type ProductQueryRepo = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  categoryId?: string;
  take: number;
  skip: number;
};

export type ListProductResponse = PaginationResponse<ProductResponse>;
