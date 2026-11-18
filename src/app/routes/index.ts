import { Router } from "express";
import { authRoutes } from "../module/auth/auth.routes";
import { userRoutes } from "../module/users/user.routes";
import { adminRoutes } from "../module/admin/admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);

export const appRoutes = router;
