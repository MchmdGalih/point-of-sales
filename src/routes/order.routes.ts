import { Router } from "express";
import {
  createOrderController,
  getAllOrderController,
  getOrderByIdController,
} from "../controller/order.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { validate } from "../middleware/zodValidation";
import { orderSchema } from "../validations/order.validation";

const orderRoutes = Router();

orderRoutes.get("/", getAllOrderController);
orderRoutes.post(
  "/create",
  authMiddleware,
  validate(orderSchema),
  createOrderController,
);

orderRoutes.get("/:id", getOrderByIdController);

export default orderRoutes;
