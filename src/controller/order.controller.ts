import type { NextFunction, Request, Response } from "express";
import {
  createOrderService,
  deleteOrderService,
  getAllOrderService,
  getOrderByIdService,
} from "../services/order.service";
import type { OrderQueryRequest } from "../validations/order.validation";
import type { CreateOrderDTO } from "../dto/order.dto";

export const getAllOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const query = res.locals.query as OrderQueryRequest;

  try {
    const result = await getAllOrderService(query);
    res.status(200).json({
      status: true,
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
  try {
    const userId = req.user?.id;
    const payload: CreateOrderDTO = {
      orderItems: req.body.orderItems,
      customerName: req.body.customerName,
    };

    const result = await createOrderService(userId as string, payload);

    res.status(201).json({
      status: true,
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
      status: true,
      message: "Order fetched successfully",
      data: result,
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
      status: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
