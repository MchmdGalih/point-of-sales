import type { NextFunction, Request, Response } from "express";
import {
  loginService,
  logoutService,
  registerService,
} from "../services/auth.service";
import { logger } from "../config/logger";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;

  try {
    const result = await logoutService(userId as string);
    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    logger.error(error);
  }
};
