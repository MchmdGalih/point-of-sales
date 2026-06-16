import type { NextFunction, Request, Response } from "express";
import {
  createOrderService,
  getAllOrderService,
  getOrderByIdService,
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

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await getOrderByIdService(id as string);
    res.status(200).json({
      status: "success",
      message: "Order fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
