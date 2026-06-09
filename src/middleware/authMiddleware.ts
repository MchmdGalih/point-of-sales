import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";
import { verifyToken } from "../utils/tokenService";
import type { JwtPayload } from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.get("Authorization")?.split(" ")[1];

  if (!header) throw new CustomError("Unauthorized", 401);

  try {
    const decode = verifyToken(header);

    req.user = decode as JwtPayload;

    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Token not found!",
    });
  }
};
