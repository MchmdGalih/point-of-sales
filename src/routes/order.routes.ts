import { Router } from "express";
import { getAllOrderController } from "../controller/order.controller";

const orderRoutes = Router();

orderRoutes.get("/", getAllOrderController);

export default orderRoutes;
