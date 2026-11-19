import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

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

//* Get Me
router.get(
  "/me",
  auth(Role.ADMIN, Role.DISPATCHER, Role.REQUESTER),
  authController.getMe,
);

//* Refresh Token
router.post("/refresh-token", authController.refreshToken);

//* Logout User
router.post("/logout", authController.logout);

//* Verify User Email
router.post(
  "/verify-email",
  validateRequest(authValidation.verifyEmailSchema),
  authController.verifyUserEmail,
);

export const authRoutes = router;
