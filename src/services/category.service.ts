import { CustomError } from "../errors/customError";
import type {
  CategoryResponse,
  CreateCategoryRequest,
} from "../model/category-model";
import {
  createCategoryRepository,
  deleteCategoryRepository,
  getAllCategoryRepository,
  getCategoryByIdRepository,
  updateCategoryRepository,
} from "../repositories/category.repository";

export const getAllCategoryService = async (): Promise<CategoryResponse[]> => {
  return await getAllCategoryRepository();
};

export const createCategoryService = async (
  name: CreateCategoryRequest,
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
  name: CreateCategoryRequest,
): Promise<CategoryResponse> => {
  return await updateCategoryRepository(id, name);
};

export const deleteCategoryService = async (
  id: string,
): Promise<CategoryResponse> => {
  return await deleteCategoryRepository(id);
};
