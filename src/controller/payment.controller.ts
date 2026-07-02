import type { NextFunction, Request, Response } from "express";
import {
  createPaymentService,
  getAllPaymentService,
  getPaymentByIdService,
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
    const { orderId } = req.params;
    const { method, amount } = req.body;

    const result = await createPaymentService(
      orderId as string,
      method,
      amount,
      req.user?.id as string,
    );
    res.status(200).json({
      status: "success",
      message: "Payment created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
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
      status: "success",
      message: "Detail payment fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
