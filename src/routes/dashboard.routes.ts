import { Router } from "express";
import {
  countPaymentMethodBreakdownController,
  getLowStockProductController,
  getRecentOrdersController,
  getTodaySummaryController,
  getTopSellingProductController,
} from "../controller/dashboard.controller";
import { validate } from "../middleware/zodValidation";
import { topProductQuerySchema } from "../validations/dashboard.validation";

const dashboardRoutes = Router();

dashboardRoutes.get("/summary", getTodaySummaryController);
dashboardRoutes.get(
  "/top-selling",
  validate(topProductQuerySchema, "query"),
  getTopSellingProductController,
);

dashboardRoutes.get("/recent-order", getRecentOrdersController);
dashboardRoutes.get("/payment-method", countPaymentMethodBreakdownController);
dashboardRoutes.get("/stock-low-products", getLowStockProductController);

export default dashboardRoutes;
