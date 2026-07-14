import { Router } from "express";
import {
  createOrderController,
  deleteOrdetController,
  getAllOrderController,
  getOrderByIdController,
} from "../controller/order.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { validate } from "../middleware/zodValidation";
import { orderQuerySchema, orderSchema } from "../validations/order.validation";
import { authorizeRole } from "../middleware/roleMiddleware";
import { paramsIdSchema } from "../validations/params-id.validation";

const orderRoutes = Router();

orderRoutes.get(
  "/",
  validate(orderQuerySchema, "query"),
  getAllOrderController,
);
orderRoutes.post(
  "/create",
  authMiddleware,
  validate(orderSchema, "body"),
  createOrderController,
);

orderRoutes.get(
  "/:id",
  validate(paramsIdSchema, "params"),
  getOrderByIdController,
);
orderRoutes.delete(
  "/:id",
  validate(paramsIdSchema, "params"),
  authMiddleware,
  authorizeRole("ADMIN"),
  deleteOrdetController,
);

export default orderRoutes;
