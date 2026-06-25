import type { NextFunction, Request, Response } from "express";
import {
  createOrderService,
  deleteOrderService,
  getAllOrderService,
  getOrderByIdService,
} from "../services/order.service";
import type { OrderStatus } from "../../generated/prisma/enums";

export const getAllOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search as string;
  const status = req.query.status as OrderStatus;
  const orderNumber = req.query.orderNumber as string;

  try {
    const result = await getAllOrderService({
      page,
      limit,
      search,
      status,
      orderNumber,
    });
    res.status(200).json({
      status: "success",
      message: "Order fetched successfully",
      data: result.data,
      meta: result.meta,
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
  const { orderItems, customerName } = req.body;
  try {
    const result = await createOrderService(userId, {
      orderItems,
      customerName,
    });

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: result.data,
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
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrdetController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await deleteOrderService(id as string);
    res.status(200).json({
      status: "success",
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
