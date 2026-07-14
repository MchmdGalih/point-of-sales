import { CustomError } from "../errors/customError";
import type { CategoryResponse } from "../model/category-model";
import {
  createCategoryRepository,
  deleteCategoryRepository,
  getAllCategoryRepository,
  getCategoryByIdRepository,
  updateCategoryRepository,
} from "../repositories/category.repository";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "../dto/category.dto";

export const getAllCategoryService = async (): Promise<CategoryResponse[]> => {
  return await getAllCategoryRepository();
};

export const createCategoryService = async (
  name: CreateCategoryDTO,
): Promise<CategoryResponse> => {
  return await createCategoryRepository(name);
};

export const getCategoryByIdService = async (
  id: string,
): Promise<CategoryResponse> => {
  const category = await getCategoryByIdRepository(id);

  if (!category) throw new CustomError("Category not found", 404);

  return category;
};

export const updateCategoryService = async (
  id: string,
  name: UpdateCategoryDTO,
): Promise<CategoryResponse> => {
  return await updateCategoryRepository(id, name);
};

export const deleteCategoryService = async (id: string): Promise<void> => {
  const category = await getCategoryByIdRepository(id);

  if (!category) throw new CustomError("Category not found", 404);

  await deleteCategoryRepository(id);
};
