import { Router } from "express";
import { hospitalController } from "./hospital.controller";

const router = Router();

router.get("/", hospitalController.getAllHospitals);

router.get("/nearby", hospitalController.getNearbyHospitals);
router.get("/:id", hospitalController.getHospitalById);

export const hospitalRoutes = router;
