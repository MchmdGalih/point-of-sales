import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type {
  CreateProductRequest,
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

  return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      stock: product.stock,
      price: product.price.toNumber(),
      category: {
        id: product.category.id,
        name: product.category.name,
      },
    })),
    totalData,
  };
};

export const createProductRepository = async (
  payload: CreateProductRequest,
): Promise<ProductResponse> => {
  const product = await prisma.product.create({
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

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    stock: product.stock,
    price: product.price.toNumber(),
    category: {
      id: product.category.id,
      name: product.category.name,
    },
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
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    stock: product.stock,
    price: product.price.toNumber(),
    category: {
      id: product.category.id,
      name: product.category.name,
    },
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
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    stock: product.stock,
    price: product.price.toNumber(),
    category: {
      id: product.category.id,
      name: product.category.name,
    },
  };
};

export const deleteProductRepository = async (id: string): Promise<void> => {
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
