import type { NextFunction, Request, Response } from "express";
import { handleMidtransNotificationService } from "../services/midtrans-notification.service";
import { logger } from "../config/logger";

export const handleMidtransNotificationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await handleMidtransNotificationService(req.body);

    logger.info("Midtrans notification received");

    res.status(200).json({
      status: true,
      message: "Midtrans notification handled successfully",
    });
  } catch (error) {
    next(error);
  }
};
