import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/dashboard", (req, res) => {
  res.send("Admin Dashboard");
});

//! users managements
router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);

router.get("/users/:id", auth(Role.ADMIN), adminController.getUserById);

router.patch(
  "/users/:id/status",
  auth(Role.ADMIN),
  adminController.changeUserStatus,
);

router.patch(
  "/users/:id/role",
  auth(Role.ADMIN),
  adminController.changeUserRole,
);

router.delete("/users/:id", auth(Role.ADMIN), adminController.deleteUser);

export const adminRoutes = router;
