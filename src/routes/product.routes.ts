import { Router } from "express";
import { getAllProductsController } from "../controller/product.controller";

const productRoutes = Router();

productRoutes.get("/", getAllProductsController);

export default productRoutes;
