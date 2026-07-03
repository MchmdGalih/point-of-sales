import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import categoryRoutes from "./category.routes";
import productRoutes from "./product.routes";
import orderRoutes from "./order.routes";
import paymentRoutes from "./payment.routes";
import notificationRoutes from "./midtrans-notification.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/order", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/midtrans-notification", notificationRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
