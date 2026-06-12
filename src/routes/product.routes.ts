import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
} from "../controller/product.controller";
import { validate } from "../middleware/zodValidation";
import { productSchema } from "../validations/product.validation";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleMiddleware";

const productRoutes = Router();

productRoutes.get("/", getAllProductsController);
productRoutes.post(
  "/create",
  authMiddleware,
  authorizeRole("ADMIN"),
  validate(productSchema),
  createProductController,
);
productRoutes.get("/:id", getProductByIdController);
productRoutes.delete(
  "/:id",
  authMiddleware,
  authorizeRole("ADMIN"),
  deleteProductController,
);

export default productRoutes;
