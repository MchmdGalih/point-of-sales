import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
} from "../controller/product.controller";
import { validate } from "../middleware/zodValidation";
import {
  productQuerySchema,
  productSchema,
  UpdateProductSchema,
} from "../validations/product.validation";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleMiddleware";

const productRoutes = Router();

productRoutes.get(
  "/",
  validate(productQuerySchema, "query"),
  getAllProductsController,
);
productRoutes.post(
  "/create",
  authMiddleware,
  authorizeRole("ADMIN"),
  validate(productSchema, "body"),
  createProductController,
);
productRoutes.get("/:id", getProductByIdController);
productRoutes.put(
  "/edit/:id",
  validate(UpdateProductSchema, "body"),
  authMiddleware,
  authorizeRole("ADMIN"),
  updateProductController,
);
productRoutes.delete(
  "/:id",
  authMiddleware,
  authorizeRole("ADMIN"),
  deleteProductController,
);

export default productRoutes;
