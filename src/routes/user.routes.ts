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
  userQuerySchema,
} from "../validations/users.validtion";
import { paramsIdSchema } from "../validations/params-id.validation";

const userRoutes = Router();

userRoutes.get("/", validate(userQuerySchema, "query"), getAllUserController);
userRoutes.post(
  "/create",
  validate(createUserSchema, "body"),
  authMiddleware,
  authorizeRole("ADMIN"),
  createUserController,
);
userRoutes.get(
  "/:id",
  validate(paramsIdSchema, "params"),
  getUserByIdController,
);
userRoutes.put(
  "/edit/:id",
  validate(updateUserSchema, "body"),
  validate(paramsIdSchema, "params"),
  authMiddleware,
  authorizeRole("ADMIN"),
  updateUserController,
);
userRoutes.delete(
  "/delete/:id",
  validate(paramsIdSchema, "params"),
  authMiddleware,
  authorizeRole("ADMIN"),
  deleteUserController,
);

export default userRoutes;
