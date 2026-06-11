import { Router } from "express";
import {
  loginController,
  registerController,
} from "../controller/auth.controller";
import { validate } from "../middleware/zodValidation";
import { loginSchema, registerSchema } from "../validations/auth.validation";

const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), registerController);
authRoutes.post("/login", validate(loginSchema), loginController);

export default authRoutes;
