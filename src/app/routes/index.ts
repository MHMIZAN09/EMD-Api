import { Router } from "express";
import { authRoutes } from "../module/auth/auth.routes";
import { userRoutes } from "../module/users/user.routes";
import { adminRoutes } from "../module/admin/admin.routes";
import { ambulanceRoutes } from "../module/ambulance/ambulance.routes";
import { hospitalRoutes } from "../module/hospital/hospital.routes";
import { driverRoutes } from "../module/driver/driver.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/ambulances", ambulanceRoutes);
router.use("/hospitals", hospitalRoutes);
router.use("/drivers", driverRoutes);



export const appRoutes = router;
