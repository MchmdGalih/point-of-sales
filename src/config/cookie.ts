import type { CookieOptions } from "express";

export const COOKIE_NAME = {
  REFRESH_TOKEN: "refreshToken",
} as const;

const REFRESH_TOKEN_EXPIRES_DAYS = Number(
  process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7,
);

export const REFRESH_TOKEN_MAX_AGE =
  REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000;

export const refreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: REFRESH_TOKEN_MAX_AGE,
};
