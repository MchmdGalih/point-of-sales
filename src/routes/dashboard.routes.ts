import { Router } from "express";
import { getTodaySummaryController } from "../controller/dashboard.controller";

const dashboardRoutes = Router();

dashboardRoutes.get("/summary", getTodaySummaryController);

export default dashboardRoutes;
