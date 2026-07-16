import jwt from "jsonwebtoken";
import "dotenv/config";
import { CustomError } from "../errors/customError";
import type { TokenPayload } from "../dto/auth.dto";

const secret = process.env.JWT_SECRET;

if (!secret) throw new CustomError("JWT_SECRET is not defined", 404);

interface Token {
  accessToken: string;
  refreshToken: string;
}

export const generateToken = (payload: TokenPayload): Token => {
  const accessToken = jwt.sign(payload, secret, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

export const verifyToken = (payload: string) => {
  return jwt.verify(payload, secret);
};
