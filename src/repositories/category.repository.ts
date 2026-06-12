import { prisma } from "../lib/prisma";
import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../validations/category.validation";

export const getAllCategoryRepository = () => {
  return prisma.category.findMany({
    where: { deletedAt: null },
  });
};

export const createCategoryRepository = (name: CreateCategoryDTO) => {
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
  name: UpdateCategoryDTO,
) => {
  return prisma.category.update({
    where: {
      id,
      deletedAt: null,
    },
    data: name,
  });
};

export const deleteCategoryRepository = (id: string) => {
  return prisma.category.delete({
    where: {
      id,
      deletedAt: new Date(),
    },
  });
};
