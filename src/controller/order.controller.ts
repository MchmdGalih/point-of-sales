import type { NextFunction, Request, Response } from "express";
import { getAllOrderService } from "../services/order.service";

export const getAllOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllOrderService();
    res.status(200).json({
      status: "success",
      message: "Order fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
