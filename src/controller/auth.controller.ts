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
import { successResponse } from "../utils/response";

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
    return successResponse(res, result, "User registered successfully");
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

    const { id, username, email, role, accessToken } = result;

    return successResponse(
      res,
      {
        id,
        username,
        email,
        role,
        accessToken,
      },
      "User logged in successfully",
    );
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

    return successResponse(res, result.accessToken, "Refresh token success");
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
    return successResponse(res, null, "User logged out successfully");
  } catch (error) {
    next(error);
  }
};
