import type { NextFunction, Request, Response } from "express";
import {
  countPaymentMethodService,
  getLowStockProductService,
  getrecenstOrdersService,
  getSalesTrendService,
  getTodaySummaryService,
  getTopSellingProductsService,
} from "../services/dashboard.service";
import type { DashboardQuery } from "../validations/dashboard.validation";
import { successResponse } from "../utils/response";

export const getTodaySummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getTodaySummaryService();

    return successResponse(res, result, "Today summary fetched successfully");
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
    const { period } = res.locals.query as DashboardQuery;

    const result = await getTopSellingProductsService(period);

    return successResponse(
      res,
      result,
      "Top selling products fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const getRecentOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getrecenstOrdersService();

    return successResponse(res, result, "Recent orders fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const countPaymentMethodBreakdownController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await countPaymentMethodService();

    return successResponse(
      res,
      result,
      "Payment method breakdown fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const getLowStockProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getLowStockProductService();
    return successResponse(
      res,
      result,
      "Low stock products fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const getSalesTrendController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { period } = res.locals.query as DashboardQuery;

    const result = await getSalesTrendService(period);

    return successResponse(res, result, "Sales trend fetched successfully");
  } catch (error) {
    next(error);
  }
};
