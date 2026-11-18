import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";

const router = Router();

//* Register User
router.post(
  "/register",
  validateRequest(authValidation.registerSchema),
  authController.RegisterUser,
);

//* Login User
router.post(
  "/login",
  validateRequest(authValidation.loginSchema),
  authController.LoginUser,
);



export const authRoutes = router;
