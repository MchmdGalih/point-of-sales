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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search as string;
  const status = req.query.status as string;
  const orderId = req.query.orderId as string;
  const method = req.query.method as string;

  try {
    const result = await getAllPaymentService({
      page,
      limit,
      search,
      status,
      orderId,
      method,
    });
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
