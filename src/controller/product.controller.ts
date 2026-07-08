import type { NextFunction, Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  getAllProductService,
  getProductByIdService,
  updateProductService,
} from "../services/product.service";
import type { ProductQueryRequest } from "../validations/product.validation";

export const getAllProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = res.locals.query as ProductQueryRequest;

    const result = await getAllProductService(query);
    res.status(200).json({
      status: "success",
      message: "Products fetched successfully",
      data: result.data,
      meta: result.meta,
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

export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await updateProductService(
      req.params.id as string,
      req.body,
    );

    res.status(201).json({
      status: "success",
      message: "Product updated successfully",
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
