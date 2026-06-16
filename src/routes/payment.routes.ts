import { Router } from "express";
import {
  createPaymentController,
  getAllPaymentController,
} from "../controller/payment.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const paymentRoutes = Router();

paymentRoutes.get("/", getAllPaymentController);
paymentRoutes.post("/", authMiddleware, createPaymentController);

export default paymentRoutes;
