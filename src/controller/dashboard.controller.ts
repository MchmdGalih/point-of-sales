import type { NextFunction, Request, Response } from "express";
import {
  getTodaySummaryService,
  getTopSellingProductsService,
} from "../services/dashboard.service";

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
    next(error);
  }
};

export const getTopSellingProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { period } = req.query as { period: "today" | "week" | "month" };

    const result = await getTopSellingProductsService(new Date(), new Date());

    res.status(200).json({
      status: "success",
      message: "Top selling products fetched successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
