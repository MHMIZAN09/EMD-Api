import { Router } from "express";

const router = Router();

router.get("/admin", (req, res) => {
  res.send("Admin Dashboard");
});

router.get("/dispatcher", (req, res) => {
  res.send("Dispatcher Dashboard");
});

router.get("/requester", (req, res) => {
  res.send("Requester Dashboard");
});

export const dashboardRoutes = router;
