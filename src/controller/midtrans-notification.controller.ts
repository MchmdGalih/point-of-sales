import type { NextFunction, Request, Response } from "express";
import { handleMidtransNotificationService } from "../services/midtrans-notification.service";
import { logger } from "../config/logger";

export const handleMidtransNotificationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    logger.info("Midtrans notification received");
    await handleMidtransNotificationService(req.body);

    res.status(200).json({
      status: "success",
      message: "Midtrans notification handled successfully",
    });
  } catch (error) {
    next(error);
  }
};
