import type { NextFunction, Request, Response } from "express";
import { getAllProductService } from "../services/product.service";

export const getAllProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllProductService();
    res.status(200).json({
      status: "success",
      message: "Products fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
