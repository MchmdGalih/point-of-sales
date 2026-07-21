import type { NextFunction, Request, Response } from "express";
import {
  createPaymentService,
  deletePaymentService,
  getAllPaymentService,
  getPaymentByIdService,
} from "../services/payments/payment.service";
import type { PaymentQueryRequest } from "../validations/payment.validation";
import { paginationResponse, successResponse } from "../utils/response";

export const getAllPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = res.locals.query as PaymentQueryRequest;
    const result = await getAllPaymentService(query);
    return paginationResponse(
      res,
      "All payments fetched successfully",
      result.data,
      result.meta,
    );
  } catch (error) {
    next(error);
  }
};

export const createPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const payload = {
      method: req.body.method,
      amount: req.body.amount,
    };

    const result = await createPaymentService(orderId as string, payload);
    return successResponse(res, result, "Payment created successfully");
  } catch (error) {
    next(error);
  }
};

export const getPaymentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await getPaymentByIdService(id as string);

    return successResponse(res, result, "Payment fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const deletePaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await deletePaymentService(id as string);

    return successResponse(res, null, "Payment deleted successfully");
  } catch (err) {
    next(err);
  }
};
