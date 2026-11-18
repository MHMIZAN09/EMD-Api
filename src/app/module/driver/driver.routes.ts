import { Router } from "express";
import { driverController } from "./driver.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/client";
import { validateRequest } from "../../middleware/validateRequest";
import { driverValidation } from "./driver.validation";

const router = Router();

router.post(
  "/:id/assign-ambulance",
  auth(Role.ADMIN, Role.DISPATCHER),
  validateRequest(driverValidation.driverAmbulancePayloadSchema),
  driverController.assignAmbulanceToDriver,
);

router.get(
  "/",
  auth(Role.ADMIN, Role.DISPATCHER),
  driverController.getAllDrivers,
);

router.get(
  "/:id",
  auth(Role.ADMIN, Role.DISPATCHER),
  driverController.getDriverById,
);

export const driverRoutes = router;
