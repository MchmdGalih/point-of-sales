import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";

export const requestlogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info("HTTP Request", {
      method: req.method,
      url: req.url,
      duration: `${duration} ms`,
    });
  });

  next();
};
