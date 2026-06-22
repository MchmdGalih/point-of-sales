export interface CreateProductPayload {
  name: string;
  price: number;
  stock: number;
  sku: string;
  categoryId: string;
}

export interface ProductQueryDTO {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  inStock?: boolean;
  categoryId?: string;
}

export interface RepoQueryProduct {
  take: number;
  skip: number;
  search?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
}
