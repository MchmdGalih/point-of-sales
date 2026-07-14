import type { NextFunction, Request, Response } from "express";
import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
} from "../services/auth.service";

import { COOKIE_NAME, refreshTokenCookieConfig } from "../config/cookie";
import { CustomError } from "../errors/customError";
import type { LoginDTO, RegisterDTO } from "../dto/auth.dto";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: RegisterDTO = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    const result = await registerService(payload);

    res.status(201).json({
      status: true,
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
    const payload: LoginDTO = {
      email: req.body.email,
      password: req.body.password,
    };

    const result = await loginService(payload);

    res.cookie(
      COOKIE_NAME.REFRESH_TOKEN,
      result.refreshToken,
      refreshTokenCookieConfig,
    );

    res.status(200).json({
      status: true,
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
      status: true,
      message: "Refresh token success",
      data: {
        accessToken: result.accessToken,
      },
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
  try {
    const refreshToken = req.cookies[COOKIE_NAME.REFRESH_TOKEN];

    if (!refreshToken) throw new CustomError("Refresh token not found", 404);

    await logoutService(refreshToken);

    res.clearCookie(COOKIE_NAME.REFRESH_TOKEN, refreshTokenCookieConfig);
    res.status(200).json({
      status: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
