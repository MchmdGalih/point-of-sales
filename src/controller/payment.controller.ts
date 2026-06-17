import type { NextFunction, Request, Response } from "express";
import {
  createPaymentService,
  getAllPaymentService,
} from "../services/payment.service";

export const getAllPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllPaymentService();
    res.status(200).json({
      status: "success",
      message: "Payment fetched successfully",
      data: result,
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
    const { orderId } = req.body;

    const result = await createPaymentService(orderId, req.user?.id as string);
    res.status(200).json({
      status: "success",
      data: {
        redirectUrl: result.redirectUrl,
        snapToken: result.snapToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
