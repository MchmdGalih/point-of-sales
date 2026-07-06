import { Router } from "express";
import {
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

export default dashboardRoutes;
