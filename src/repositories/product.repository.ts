import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type {
  CreateProductRequest,
  ListProductResponse,
  ProductQueryRepo,
  ProductResponse,
  UpdateProductRequest,
} from "../model/product-model";

export const getAllProductRepository = async (
  query: ProductQueryRepo,
): Promise<{ products: ProductResponse[]; totalData: number }> => {
  const { skip, take, search, minPrice, maxPrice, inStock, categoryId } = query;

  const where = {
    deletedAt: null,
    ...(search && {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
      ...(search && {
        sku: {
          contains: search,
          mode: "insensitive" as const,
        },
      }),
    }),
    ...((minPrice || maxPrice) && {
      price: {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      },
    }),
    ...(inStock && { stock: { gt: 0 } }),
    ...(categoryId && { categoryId }),
  };

  const [products, totalData] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
    })),
    totalData,
  };
};

export const createProductRepository = async (
  payload: CreateProductRequest,
): Promise<ProductResponse> => {
  const product = await prisma.product.create({
    data: payload,
  });

  return {
    ...product,
    price: product.price.toNumber(),
  };
};

export const updateProductRepository = async (
  id: string,
  payload: UpdateProductRequest,
): Promise<ProductResponse> => {
  const product = await prisma.product.update({
    where: {
      id,
      deletedAt: null,
    },
    data: payload,
  });

  return {
    ...product,
    price: product.price.toNumber(),
  };
};

export const getProductByIdRepository = async (
  id: string,
): Promise<ProductResponse | null> => {
  const product = await prisma.product.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!product) return null;

  return {
    ...product,
    price: product.price.toNumber(),
  };
};

export const deleteProductRepository = (id: string): Promise<any> => {
  return prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const getProductByIdsRepository = (ids: string[]) => {
  return prisma.product.findMany({
    where: {
      id: { in: ids },
      deletedAt: null,
    },
  });
};

export const decrementProductRepository = (
  tx: Prisma.TransactionClient,
  productId: string,
  quantity: number,
) => {
  return tx.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } },
  });
};
