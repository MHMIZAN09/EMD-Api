import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { ambulanceValidation } from "../ambulance/ambulance.validation";
import { hospitalValidation } from "../hospital/hospital.validation";
import { driverValidation } from "../driver/driver.validation";
import z from "zod";
import { adminValidation } from "./admin.validation";

const router = Router();

const createDispatcherSchema = z.object({
  name: z
    .string("Name is required")
    .min(3, "Name must have at least 3 characters"),
  email: z.email("A valid email is required"),
  phone: z
    .string("Phone number is required")
    .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
});

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

router.post(
  "/dispatchers",
  auth(Role.ADMIN),
  validateRequest(adminValidation.createDispatcherSchema),
  adminController.createDispatcher,
);

//! ambulance management
router.post(
  "/ambulances",
  auth(Role.ADMIN),
  validateRequest(ambulanceValidation.ambulancePayloadSchema),
  adminController.createAmbulance,
);

router.patch(
  "/ambulances/:id",
  auth(Role.ADMIN),
  validateRequest(ambulanceValidation.ambulanceUpdatePayloadSchema),
  adminController.updateAmbulance,
);

router.delete(
  "/ambulances/:id",
  auth(Role.ADMIN),
  adminController.deleteAmbulance,
);

//! hospital management
router.post(
  "/hospitals",
  auth(Role.ADMIN),
  validateRequest(hospitalValidation.hospitalPayloadSchema),
  adminController.createHospital,
);

router.patch(
  "/hospitals/:id",
  auth(Role.ADMIN),
  validateRequest(hospitalValidation.hospitalUpdatePayloadSchema),
  adminController.updateHospital,
);

router.delete(
  "/hospitals/:id",
  auth(Role.ADMIN),
  adminController.deleteHospital,
);

router.get("/hospitals", auth(Role.ADMIN), adminController.getAllHospitals);

router.get("/hospitals/:id", auth(Role.ADMIN), adminController.getHospitalById);

router.patch(
  "/hospitals/:id/status",
  auth(Role.ADMIN),
  validateRequest(hospitalValidation.hospitalStausPayloadSchema),
  adminController.hospitalStatus,
);

//! driver management
router.post(
  "/drivers",
  auth(Role.ADMIN),
  validateRequest(driverValidation.driverPayloadSchema),
  adminController.createDriver,
);

router.patch(
  "/drivers/:id",
  auth(Role.ADMIN),
  validateRequest(driverValidation.driverUpdatePayloadSchema),
  adminController.updateDriver,
);

router.delete("/drivers/:id", auth(Role.ADMIN), adminController.deleteDriver);

export const adminRoutes = router;
