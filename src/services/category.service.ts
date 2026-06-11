import { CustomError } from "../errors/customError";
import {
  createCategoryRepository,
  deleteCategoryRepository,
  getAllCategoryRepository,
  getCategoryByIdRepository,
  updateCategoryRepository,
} from "../repositories/category.repository";
import type { CreateCategoryDTO } from "../validations/category.validation";

export const getAllCategoryService = async () => {
  return await getAllCategoryRepository();
};

export const createCategoryService = async (name: CreateCategoryDTO) => {
  return await createCategoryRepository(name);
};

export const getCategoryByIdService = async (id: string) => {
  const category = await getCategoryByIdRepository(id);

  if (!category) throw new CustomError("Category not found", 404);

  return category;
};

export const updateCategoryService = async (
  id: string,
  name: CreateCategoryDTO,
) => {
  return await updateCategoryRepository(id, name);
};

export const deleteCategoryService = async (id: string) => {
  return await deleteCategoryRepository(id);
};
