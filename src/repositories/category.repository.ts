import { prisma } from "../lib/prisma";
import type {
  CategoryResponse,
  CreateCategoryRequest,
} from "../model/category-model";

export const getAllCategoryRepository = (): Promise<CategoryResponse[]> => {
  return prisma.category.findMany({
    where: { deletedAt: null },
  });
};

export const createCategoryRepository = (
  name: CreateCategoryRequest,
): Promise<CategoryResponse> => {
  return prisma.category.create({ data: name });
};

export const getCategoryByIdRepository = (
  id: string,
): Promise<CategoryResponse | null> => {
  return prisma.category.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });
};

export const updateCategoryRepository = (
  id: string,
  name: CreateCategoryRequest,
): Promise<CategoryResponse> => {
  return prisma.category.update({
    where: {
      id,
      deletedAt: null,
    },
    data: name,
  });
};

export const deleteCategoryRepository = async (id: string): Promise<void> => {
  await prisma.category.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
