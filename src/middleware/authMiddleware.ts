import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";
import { verifyToken } from "../utils/token-service";
import type { TokenPayload } from "../model/user-model";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.get("Authorization")?.split(" ")[1];

    if (!authHeader) throw new CustomError("Unauthorized", 401);

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token)
      throw new CustomError("Invalid authorization format", 401);

    const decode = verifyToken(token) as TokenPayload;
    req.user = decode;

    next();
  } catch (error) {
    next(error);
  }
};
