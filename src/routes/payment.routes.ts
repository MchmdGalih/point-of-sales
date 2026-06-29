import { Router } from "express";
import {
  createPaymentController,
  getAllPaymentController,
} from "../controller/payment.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleMiddleware";
import { paymentSchema } from "../validations/payment.validation";
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
  "/midtrans",
  authMiddleware,
  validate(paymentSchema),
  createPaymentController,
);

export default paymentRoutes;
