import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
} from "../controller/auth.controller";
import { validate } from "../middleware/zodValidation";
import { loginSchema, registerSchema } from "../validations/auth.validation";

const authRoutes = Router();

authRoutes.post(
  "/register",
  validate(registerSchema, "body"),
  registerController,
);
authRoutes.post("/login", validate(loginSchema, "body"), loginController);
authRoutes.post("/refresh-token", refreshTokenController);
authRoutes.post("/logout", logoutController);

export default authRoutes;
