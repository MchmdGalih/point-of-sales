import { Router } from "express";
import {
  createCategoryController,
  getAllCategoryController,
  getCategoryByIdController,
  updateCategoryController,
} from "../controller/caregory.controller";
import { validate } from "../middleware/zodValidation";
import { categorySchema } from "../validations/category.validation";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleMiddleware";

const categoryRoutes = Router();

categoryRoutes.get("/", getAllCategoryController);
categoryRoutes.post(
  "/create",
  authMiddleware,
  authorizeRole("ADMIN"),
  validate(categorySchema),
  createCategoryController,
);

categoryRoutes.get("/:id", getCategoryByIdController);
categoryRoutes.put(
  "/edit/:id",
  authMiddleware,
  authorizeRole("ADMIN"),
  updateCategoryController,
);
categoryRoutes.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRole("ADMIN"),
  updateCategoryController,
);

export default categoryRoutes;
