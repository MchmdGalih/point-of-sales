import jwt from "jsonwebtoken";
import "dotenv/config";
import { CustomError } from "../errors/customError";

export const generateToken = (payload: object): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) throw new CustomError("JWT_SECRET is not defined", 404);

  return jwt.sign(payload, secret, { expiresIn: "1d" });
};

export const verifyToken = (payload: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new CustomError("JWT_SECRET is not defined", 404);
  return jwt.verify(payload, secret);
};
