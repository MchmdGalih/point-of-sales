import { Router } from "express";
import {
  createPaymentController,
  deletePaymentController,
  getAllPaymentController,
  getPaymentByIdController,
} from "../controller/payment.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  paramsSchema,
  paymentQuerySchema,
  paymentSchema,
} from "../validations/payment.validation";
import { validate } from "../middleware/zodValidation";
import { authorizeRole } from "../middleware/roleMiddleware";
import { paramsIdSchema } from "../validations/params-id.validation";

const paymentRoutes = Router();

paymentRoutes.get(
  "/",
  validate(paymentQuerySchema, "query"),
  authMiddleware,
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

paymentRoutes.get(
  "/:id",
  validate(paramsIdSchema, "params"),
  getPaymentByIdController,
);

paymentRoutes.delete(
  "/:id",
  validate(paramsIdSchema, "params"),
  authMiddleware,
  authorizeRole("ADMIN"),
  deletePaymentController,
);
export default paymentRoutes;
