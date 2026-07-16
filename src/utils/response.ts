import { type Response } from "express";
import type { ApiResponse } from "../types/api-response";
import type { PaginationMeta } from "../types/pagination";

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string,
  statusCode = 200,
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};

export const paginationResponse = <T>(
  res: Response,
  message: string,
  data: T[],
  meta: PaginationMeta,
) => {
  return res.status(200).json({
    status: true,
    message,
    data,
    meta,
  });
};
