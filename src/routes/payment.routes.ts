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
  "/cash",
  authMiddleware,
  validate(paymentSchema),
  createPaymentController,
);

paymentRoutes.post(
  "/midtrans/:orderId",
  authMiddleware,
  validate(paramsSchema),
  validate(paymentSchema),
  createPaymentController,
);

paymentRoutes.get("/:id", getPaymentByIdController);
export default paymentRoutes;
