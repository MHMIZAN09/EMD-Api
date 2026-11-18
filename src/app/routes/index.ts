import { Router } from "express";
import { authRoutes } from "../module/auth/auth.routes";
import { userRoutes } from "../module/users/user.routes";
import { adminRoutes } from "../module/admin/admin.routes";
import { ambulanceRoutes } from "../module/ambulance/ambulance.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/ambulances", ambulanceRoutes);

export const appRoutes = router;
