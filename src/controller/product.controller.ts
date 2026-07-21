import type { NextFunction, Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  getAllProductService,
  getProductByIdService,
  updateProductService,
} from "../services/product.service";
import type { ProductQueryRequest } from "../validations/product.validation";
import type { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto";
import { paginationResponse, successResponse } from "../utils/response";

export const getAllProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = res.locals.query as ProductQueryRequest;
    const result = await getAllProductService(query);
    return paginationResponse(
      res,
      "Products fetched successfully",
      result.data,
      result.meta,
    );
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
    const payload: CreateProductDTO = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      categoryId: req.body.categoryId,
    };

    const result = await createProductService(payload);
    return successResponse(res, result, "Product created successfully");
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
    return successResponse(res, result, "Product fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: UpdateProductDTO = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      categoryId: req.body.categoryId,
    };

    const result = await updateProductService(req.params.id as string, payload);
    return successResponse(res, result, "Product updated successfully");
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
    return successResponse(res, null, "Product deleted successfully");
  } catch (error) {
    next(error);
  }
};
