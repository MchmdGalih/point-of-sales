import type { NextFunction, Request, Response } from "express";
import { loginService, registerService } from "../services/auth.service";

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
