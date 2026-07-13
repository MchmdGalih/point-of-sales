import type { NextFunction, Request, Response } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoryService,
  getCategoryByIdService,
  updateCategoryService,
} from "../services/category.service";

export const getAllCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllCategoryService();
    res.status(200).json({
      status: true,
      message: "Category fetched successfully",
      data: result,
    });
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
    const result = await createCategoryService(req.body);
    res.status(201).json({
      status: true,
      message: "Category created successfully",
      data: result,
    });
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
    res.status(200).json({
      status: true,
      message: "Category fetched successfully",
      data: result,
    });
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
    const result = await updateCategoryService(
      req.params.id as string,
      req.body,
    );
    res.status(200).json({
      status: true,
      message: "Category updated successfully",
      data: result,
    });
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
    res.status(200).json({
      status: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
