import type { NextFunction, Request, Response } from "express";
import {
  createPaymentService,
  deletePaymentService,
  getAllPaymentService,
  getPaymentByIdService,
} from "../services/payments/payment.service";
import type { PaymentQueryRequest } from "../validations/payment.validation";

export const getAllPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = res.locals.query as PaymentQueryRequest;
    const result = await getAllPaymentService(query);
    res.status(200).json({
      status: true,
      message: "Payment fetched successfully",
      data: result.data,
      meta: result.meta,
    });
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
    res.status(200).json({
      status: true,
      message: "Payment created successfully",
      data: result,
    });
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

    res.status(200).json({
      status: true,
      message: "Detail payment fetched successfully",
      data: result,
    });
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
    res.status(200).json({
      status: true,
      message: "Payment deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
