import type { Product } from "../../../generated/prisma/client";
import type { ProductResponse } from "../../model/product-model";

export const serializeProduct = (product: any): ProductResponse => ({
  id: product.id,
  name: product.name,
  price: product.price,
  stock: product.stock,
  sku: product.sku,
  category: {
    id: product.category.id,
    name: product.category.name,
  },
});

export const serializeProducts = (products: Product[]): ProductResponse[] =>
  products.map((product) => serializeProduct(product));
