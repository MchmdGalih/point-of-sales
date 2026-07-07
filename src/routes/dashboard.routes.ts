import { Router } from "express";
import {
  countPaymentMethodBreakdownController,
  getLowStockProductController,
  getRecentOrdersController,
  getSalesTrendController,
  getTodaySummaryController,
  getTopSellingProductController,
} from "../controller/dashboard.controller";
import { validate } from "../middleware/zodValidation";
import { filterByPeriodQuerySchema } from "../validations/dashboard.validation";

const dashboardRoutes = Router();

dashboardRoutes.get("/summary", getTodaySummaryController);
dashboardRoutes.get(
  "/top-selling",
  validate(filterByPeriodQuerySchema, "query"),
  getTopSellingProductController,
);

dashboardRoutes.get("/recent-order", getRecentOrdersController);
dashboardRoutes.get("/payment-method", countPaymentMethodBreakdownController);
dashboardRoutes.get("/stock-low-products", getLowStockProductController);
dashboardRoutes.get(
  "/sales-trend",
  validate(filterByPeriodQuerySchema, "query"),
  getSalesTrendController,
);

export default dashboardRoutes;
