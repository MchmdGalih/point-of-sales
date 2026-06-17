import type { NextFunction, Request, Response } from "express";
import { handleMidtransNotificationService } from "../services/midtrans-notification.service";

export const handleMidtransNotificationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await handleMidtransNotificationService(req.body);
  } catch (error) {
    console.log(error);
  }
};
