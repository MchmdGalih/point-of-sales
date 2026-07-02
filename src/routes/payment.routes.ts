import { Router } from "express";
import {
  createPaymentController,
  getAllPaymentController,
  getPaymentByIdController,
} from "../controller/payment.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleMiddleware";
import { paramsSchema, paymentSchema } from "../validations/payment.validation";
import { validate } from "../middleware/zodValidation";

const paymentRoutes = Router();

paymentRoutes.get(
  "/",
  authMiddleware,
  authorizeRole("ADMIN"),
  getAllPaymentController,
);
paymentRoutes.post(
  "/cash/:orderId",
  authMiddleware,
  validate(paramsSchema, "params"),
  validate(paymentSchema, "body"),
  createPaymentController,
);

paymentRoutes.post(
  "/midtrans/:orderId",
  authMiddleware,
  validate(paramsSchema, "params"),
  validate(paymentSchema, "body"),
  createPaymentController,
);

paymentRoutes.get("/:id", getPaymentByIdController);
export default paymentRoutes;
