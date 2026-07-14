import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  getCategoryByIdController,
  updateCategoryController,
} from "../controller/category.controller";
import { validate } from "../middleware/zodValidation";
import { categorySchema } from "../validations/category.validation";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleMiddleware";
import { paramsIdSchema } from "../validations/params-id.validation";

const categoryRoutes = Router();

categoryRoutes.get("/", getAllCategoryController);
categoryRoutes.post(
  "/create",
  authMiddleware,
  authorizeRole("ADMIN"),
  validate(categorySchema, "body"),
  createCategoryController,
);

categoryRoutes.get(
  "/:id",
  validate(paramsIdSchema, "params"),
  getCategoryByIdController,
);
categoryRoutes.put(
  "/edit/:id",
  validate(paramsIdSchema, "params"),
  validate(categorySchema, "body"),
  authMiddleware,
  authorizeRole("ADMIN"),
  updateCategoryController,
);
categoryRoutes.delete(
  "/delete/:id",
  validate(paramsIdSchema, "params"),
  authMiddleware,
  authorizeRole("ADMIN"),
  deleteCategoryController,
);

export default categoryRoutes;
