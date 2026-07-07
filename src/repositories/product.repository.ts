import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type {
  CreateProductRequest,
  ProductQueryRepo,
  UpdateProductRequest,
} from "../model/product-model";

const LOW_STOCK_THRESHOLD = 5;

export const getAllProductRepository = async (query: ProductQueryRepo) => {
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
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, totalData };
};

export const createProductRepository = async (
  payload: CreateProductRequest,
) => {
  return await prisma.product.create({
    data: payload,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const updateProductRepository = async (
  id: string,
  payload: UpdateProductRequest,
) => {
  return await prisma.product.update({
    where: {
      id,
      deletedAt: null,
    },
    data: payload,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getProductByIdRepository = async (id: string) => {
  return await prisma.product.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const deleteProductRepository = async (id: string) => {
  await prisma.product.update({
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

export const getTotalProducts = () => {
  return prisma.product.count({
    where: {
      deletedAt: null,
    },
  });
};

export const countTotalLowStockProducts = () => {
  return prisma.product.count({
    where: {
      deletedAt: null,
      stock: { lte: LOW_STOCK_THRESHOLD },
    },
    take: 5,
  });
};

export const getTotalLowStockProducts = () => {
  return prisma.product.findMany({
    where: {
      deletedAt: null,
      stock: { lte: LOW_STOCK_THRESHOLD },
    },
    select: {
      id: true,
      name: true,
      stock: true,
    },
    orderBy: { stock: "desc" },
  });
};
