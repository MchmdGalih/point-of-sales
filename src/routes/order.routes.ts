import { Router } from "express";
import {
  createOrderController,
  deleteOrdetController,
  getAllOrderController,
  getOrderByIdController,
} from "../controller/order.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { validate } from "../middleware/zodValidation";
import { orderSchema } from "../validations/order.validation";
import { authorizeRole } from "../middleware/roleMiddleware";

const orderRoutes = Router();

orderRoutes.get("/", getAllOrderController);
orderRoutes.post(
  "/create",
  authMiddleware,
  validate(orderSchema, "body"),
  createOrderController,
);

orderRoutes.get("/:id", getOrderByIdController);
orderRoutes.delete(
  "/:id",
  authMiddleware,
  authorizeRole("ADMIN"),
  deleteOrdetController,
);

export default orderRoutes;
