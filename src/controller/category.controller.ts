import type { NextFunction, Request, Response } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoryService,
  getCategoryByIdService,
  updateCategoryService,
} from "../services/category.service";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "../dto/category.dto";
import { successResponse } from "../utils/response";

export const getAllCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllCategoryService();
    return successResponse(res, result, "Categories fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: CreateCategoryDTO = {
      name: req.body.name,
    };

    const result = await createCategoryService(payload);
    return successResponse(res, result, "Category created successfully");
  } catch (error) {
    next(error);
  }
};

export const getCategoryByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getCategoryByIdService(req.params.id as string);
    return successResponse(res, result, "Category fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: UpdateCategoryDTO = {
      name: req.body.name,
    };

    const result = await updateCategoryService(
      req.params.id as string,
      payload,
    );
    return successResponse(res, result, "Category updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteCategoryService(req.params.id as string);
    return successResponse(res, null, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};
