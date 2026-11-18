import { Router } from "express";
import { authRoutes } from "../module/auth/auth.routes";
import { userRoutes } from "../module/users/user.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
export const appRoutes = router;
