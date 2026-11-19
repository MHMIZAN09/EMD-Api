import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { dashboardController } from "./dashboard.controller";

const router = Router();

router.get("/admin", auth(Role.ADMIN), dashboardController.getAnalyticsAdmin);

router.get(
  "/dispatcher",
  auth(Role.DISPATCHER),
  dashboardController.getAnalyticsDispatcher,
);

router.get(
  "/requester",
  auth(Role.REQUESTER),
  dashboardController.getAnalyticsRequester,
);

export const dashboardRoutes = router;
