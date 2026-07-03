import type { NextFunction, Request, Response } from "express";
import { getTodaySummaryService } from "../services/dashboard.service";

export const getTodaySummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getTodaySummaryService();

    res.status(200).json({
      status: "success",
      message: "Today summary fetched successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
