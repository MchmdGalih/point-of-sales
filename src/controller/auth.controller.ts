import type { NextFunction, Request, Response } from "express";
import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
} from "../services/auth.service";
import { logger } from "../config/logger";
import { COOKIE_NAME, refreshTokenCookieConfig } from "../config/cookie";
import { CustomError } from "../errors/customError";

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

    res.cookie(
      COOKIE_NAME.REFRESH_TOKEN,
      result.refreshToken,
      refreshTokenCookieConfig,
    );
    console.log(COOKIE_NAME.REFRESH_TOKEN, result.refreshToken);

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: {
        id: result.id,
        username: result.username,
        email: result.email,
        role: result.role,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies[COOKIE_NAME.REFRESH_TOKEN];

    const result = await refreshTokenService(refreshToken);

    res.cookie(
      COOKIE_NAME.REFRESH_TOKEN,
      result.refreshToken,
      refreshTokenCookieConfig,
    );

    res.status(200).json({
      status: "success",
      message: "Refresh token success",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {}
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies[COOKIE_NAME.REFRESH_TOKEN];

    if (!refreshToken) throw new CustomError("Refresh token not found", 404);

    console.log(refreshToken, "--> controller");

    await logoutService(refreshToken);

    res.clearCookie(COOKIE_NAME.REFRESH_TOKEN, refreshTokenCookieConfig);
    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
