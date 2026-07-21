import type { NextFunction, Request, Response } from "express";
import {
  createOrderService,
  deleteOrderService,
  getAllOrderService,
  getOrderByIdService,
} from "../services/order.service";
import type { OrderQueryRequest } from "../validations/order.validation";
import type { CreateOrderDTO } from "../dto/order.dto";
import { paginationResponse, successResponse } from "../utils/response";

export const getAllOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const query = res.locals.query as OrderQueryRequest;

  try {
    const result = await getAllOrderService(query);
    return paginationResponse(
      res,
      "Orders fetched successfully",
      result.data,
      result.meta,
    );
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

    return successResponse(res, result, "Order created successfully");
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
    return successResponse(res, result, "Order fetched successfully");
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
    return successResponse(res, null, "Order deleted successfully");
  } catch (error) {
    next(error);
  }
};
