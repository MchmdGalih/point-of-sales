import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import { CustomError } from "./customError";
import { handlePrismaError } from "./prismaError";
import jwt from "jsonwebtoken";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      status: false,
      message: "Token expired",
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = handlePrismaError(err);
    return res.status(mapped.statusCode).json({
      status: mapped.status,
      message: mapped.message,
    });
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: false,
    message: "Something went wrong",
  });
};
