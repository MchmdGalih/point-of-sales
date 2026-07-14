import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import type {
  CategoryResponse,
  CreateCategoryRequest,
} from "../model/category-model";

export const getAllCategoryRepository = () => {
  return prisma.category.findMany({
    where: { deletedAt: null },
  });
};

export const createCategoryRepository = (name: Prisma.CategoryCreateInput) => {
  return prisma.category.create({ data: name });
};

export const getCategoryByIdRepository = (id: string) => {
  return prisma.category.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });
};

export const updateCategoryRepository = (
  id: string,
  name: Prisma.CategoryUpdateInput,
) => {
  return prisma.category.update({
    where: {
      id,
      deletedAt: null,
    },
    data: name,
  });
};

export const deleteCategoryRepository = async (id: string) => {
  await prisma.category.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
