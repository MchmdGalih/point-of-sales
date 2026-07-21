import type { NextFunction, Request, Response } from "express";
import { handleMidtransNotificationService } from "../services/midtrans-notification.service";
import { logger } from "../config/logger";
import { successResponse } from "../utils/response";

export const handleMidtransNotificationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await handleMidtransNotificationService(req.body);

    logger.info("Midtrans notification received");

    return successResponse(res, null, "Midtrans notification received");
  } catch (error) {
    next(error);
  }
};
