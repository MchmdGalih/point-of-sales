import express from "express";
import type { TokenPayload } from "../../dto/auth.dto";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
