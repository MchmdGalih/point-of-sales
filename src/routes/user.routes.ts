import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getAllUserController,
  getUserByIdController,
  updateUserController,
} from "../controller/user.controller";
import { authorizeRole } from "../middleware/roleMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import { validate } from "../middleware/zodValidation";
import {
  createUserSchema,
  updateUserSchema,
} from "../validations/users.validtion";

const userRoutes = Router();

userRoutes.get("/", getAllUserController);
userRoutes.post(
  "/create",
  validate(createUserSchema),
  authMiddleware,
  authorizeRole("ADMIN"),
  createUserController,
);
userRoutes.get("/:id", getUserByIdController);
userRoutes.put(
  "/edit/:id",
  validate(updateUserSchema),
  authMiddleware,
  authorizeRole("ADMIN"),
  updateUserController,
);
userRoutes.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRole("ADMIN"),
  deleteUserController,
);
export default userRoutes;
