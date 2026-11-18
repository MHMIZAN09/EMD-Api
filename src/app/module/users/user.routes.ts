import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { userValidation } from "./user.validation";

const router = Router();

router.patch(
  "/profile",
  auth(Role.ADMIN, Role.DISPATCHER, Role.REQUESTER),
  validateRequest(userValidation.userUpdateSchema),
  userController.updateProfile,
);

router.get(
  "/profile",
  auth(Role.ADMIN, Role.DISPATCHER, Role.REQUESTER),
  userController.getProfile,
);

export const userRoutes = router;
