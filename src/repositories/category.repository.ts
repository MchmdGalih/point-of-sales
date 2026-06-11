import { prisma } from "../lib/prisma";
import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../validations/category.validation";

export const getAllCategoryRepository = () => {
  return prisma.categories.findMany({
    where: { deletedAt: null },
  });
};

export const createCategoryRepository = (name: CreateCategoryDTO) => {
  return prisma.categories.create({ data: name });
};

export const getCategoryByIdRepository = (id: string) => {
  return prisma.categories.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });
};

export const updateCategoryRepository = (
  id: string,
  name: UpdateCategoryDTO,
) => {
  return prisma.categories.update({
    where: {
      id,
      deletedAt: null,
    },
    data: name,
  });
};

export const deleteCategoryRepository = (id: string) => {
  return prisma.categories.delete({
    where: {
      id,
      deletedAt: new Date(),
    },
  });
};
