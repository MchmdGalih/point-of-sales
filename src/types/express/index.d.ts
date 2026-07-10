import express from "express";
import type { TokenPayload } from "../../model/user-model";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
