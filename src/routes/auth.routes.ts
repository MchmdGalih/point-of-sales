import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "../controller/auth.controller";
import { validate } from "../middleware/zodValidation";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { authMiddleware } from "../middleware/authMiddleware";

const authRoutes = Router();

authRoutes.post(
  "/register",
  validate(registerSchema, "body"),
  registerController,
);
authRoutes.post("/login", validate(loginSchema, "body"), loginController);
authRoutes.post("/logout", authMiddleware, logoutController);

export default authRoutes;
