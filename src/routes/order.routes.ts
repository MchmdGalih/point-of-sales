import { Router } from "express";
import {
  createOrderController,
  getAllOrderController,
} from "../controller/order.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const orderRoutes = Router();

orderRoutes.get("/", getAllOrderController);
orderRoutes.post("/create", authMiddleware, createOrderController);

export default orderRoutes;
