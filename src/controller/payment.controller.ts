import type { NextFunction, Request, Response } from "express";
import {
  createPaymentService,
  getAllPaymentService,
} from "../services/payments/payment.service";
import type {
  PaymentMethod,
  PaymentStatus,
} from "../../generated/prisma/enums";

export const getAllPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const paymentNumber = req.query.paymentNumber as string;
  const status = req.query.status as PaymentStatus;
  const orderId = req.query.orderId as string;
  const method = req.query.method as PaymentMethod;

  try {
    const result = await getAllPaymentService({
      page,
      limit,
      paymentNumber,
      status,
      orderId,
      method,
    });
    res.status(200).json({
      status: "success",
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
    const { orderId, method } = req.body;

    const result = await createPaymentService(
      orderId,
      method,
      req.user?.id as string,
    );
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
