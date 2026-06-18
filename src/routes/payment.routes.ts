import { Router } from "express";
import {
  createPaymentController,
  getAllPaymentController,
} from "../controller/payment.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleMiddleware";

const paymentRoutes = Router();

paymentRoutes.get(
  "/",
  authMiddleware,
  authorizeRole("ADMIN"),
  getAllPaymentController,
);
paymentRoutes.post("/", authMiddleware, createPaymentController);

export default paymentRoutes;
