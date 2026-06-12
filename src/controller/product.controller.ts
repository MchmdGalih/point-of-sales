import type { NextFunction, Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  getAllProductService,
  getProductByIdService,
} from "../services/product.service";

export const getAllProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || 0;
    const inStock = req.query.inStock === "true" ? true : false;
    const categoryId = req.query.categoryId as string;

    const result = await getAllProductService({
      page,
      limit,
      search,
      minPrice,
      maxPrice,
      inStock,
      categoryId,
    });
    res.status(200).json({
      status: "success",
      message: "Products fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await createProductService(req.body);
    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getProductByIdService(req.params.id as string);
    res.status(200).json({
      status: "success",
      message: "Product fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteProductService(req.params.id as string);
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
