import type { NextFunction, Request, Response } from "express";
import {
  createOrderService,
  getAllOrderService,
} from "../services/order.service";

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

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  try {
    const result = await createOrderService(userId, req.body);
  } catch (error) {
    console.log(error);
  }
};
