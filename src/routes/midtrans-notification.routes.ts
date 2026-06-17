import { Router } from "express";
import { handleMidtransNotificationController } from "../controller/midtrans-notification.controller";

const notificationRoutes = Router();

notificationRoutes.post("/webhook", handleMidtransNotificationController);

export default notificationRoutes;
