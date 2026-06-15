import type { Prisma } from "../../generated/prisma/client";
import type { CreateProductPayload, ProductQueryDTO } from "../dto/product.dto";
import { prisma } from "../lib/prisma";
import type { UpdateProductPayload } from "../validations/product.validation";

export const getAllProductRepository = async (query: ProductQueryDTO) => {
  const {
    page = 1,
    limit = 10,
    search,
    minPrice,
    maxPrice,
    inStock,
    categoryId,
  } = query;

  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(search && {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
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
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      totalData,
      totalPage: Math.ceil(totalData / limit),
    },
  };
};

export const createProductRepository = (payload: CreateProductPayload) => {
  return prisma.product.create({
    data: payload,
  });
};

export const updateProductRepository = (
  id: string,
  payload: UpdateProductPayload,
) => {
  return prisma.product.update({
    where: {
      id,
      deletedAt: null,
    },
    data: payload as object,
  });
};

export const getProductByIdRepository = (id: string) => {
  return prisma.product.findUnique({ where: { id, deletedAt: null } });
};

export const deleteProductRepository = (id: string) => {
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
