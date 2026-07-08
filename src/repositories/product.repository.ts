import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type {
  CreateProductRequest,
  ProductQueryRepo,
  UpdateProductRequest,
} from "../model/product-model";

const LOW_STOCK_THRESHOLD = 5;

export const getAllProductRepository = async (query: ProductQueryRepo) => {
  const { skip, take, search, minPrice, maxPrice, categoryId } = query;

  const where = {
    deletedAt: null,
    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          sku: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
        },
        ...(maxPrice !== undefined && { lte: maxPrice }),
      }),
      ...(categoryId && { categoryId }),
    }),
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

export const createProductRepository = (payload: CreateProductRequest) => {
  return prisma.product.create({
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

export const updateProductRepository = (
  id: string,
  payload: UpdateProductRequest,
) => {
  return prisma.product.update({
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

export const getProductByIdRepository = (id: string) => {
  return prisma.product.findUnique({
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
