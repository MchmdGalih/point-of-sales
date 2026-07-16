import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import { CustomError } from "./customError";
import { handlePrismaError } from "./prismaError";
import jwt from "jsonwebtoken";
import type { ErrorResponse } from "../types/api-response";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof jwt.TokenExpiredError) {
    const response: ErrorResponse = {
      success: false,
      message: "Token expired",
    };

    return res.status(401).json(response);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = handlePrismaError(err);
    const response: ErrorResponse = {
      success: false,
      message: mapped.message,
    };

    return res.status(mapped.statusCode).json(response);
  }

  if (err instanceof CustomError) {
    const response: ErrorResponse = {
      success: false,
      message: err.message,
    };
    return res.status(err.statusCode).json(response);
  }

  const response: ErrorResponse = {
    success: false,
    message: "Something went wrong, please try again later",
  };
  return res.status(500).json(response);
};
