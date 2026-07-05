import { Router } from "express";
import {
  getTodaySummaryController,
  getTopSellingProductController,
} from "../controller/dashboard.controller";

const dashboardRoutes = Router();

dashboardRoutes.get("/summary", getTodaySummaryController);
dashboardRoutes.get("/top-selling", getTopSellingProductController);

export default dashboardRoutes;
