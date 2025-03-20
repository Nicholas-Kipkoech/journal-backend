import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { AnalyticsController } from "../controllers/analyticsController";

const analyticsRouter = Router();

analyticsRouter.post(
  "/",
  authenticateUser,
  AnalyticsController.getDataAnalytics
);

export default analyticsRouter;
