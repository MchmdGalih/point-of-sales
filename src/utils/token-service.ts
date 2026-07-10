import jwt from "jsonwebtoken";
import "dotenv/config";
import { CustomError } from "../errors/customError";

const secret = process.env.JWT_SECRET;

if (!secret) throw new CustomError("JWT_SECRET is not defined", 404);

export const generateToken = (payload: object) => {
  const accessToken = jwt.sign(payload, secret, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

export const verifyToken = (payload: string) => {
  return jwt.verify(payload, secret);
};
