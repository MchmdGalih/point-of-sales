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
    const { period } = res.locals.query as DashboardQuery;

    const result = await getTopSellingProductsService(period);

    res.status(200).json({
      status: "success",
      message: "Top selling products fetched successfully",
      data: result,
    });
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

    res.status(200).json({
      status: "success",
      message: "Recent orders fetched successfully",
      data: result,
    });
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

    res.status(200).json({
      status: "success",
      message: "Payment method breakdown fetched successfully",
      data: result,
    });
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
    res.status(200).json({
      status: "success",
      message: "Low stock products fetched successfully",
      data: result,
    });
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
    return res.status(200).json({
      status: "success",
      message: "Sales trend fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
