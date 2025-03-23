import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { AnalyticsController } from "../controllers/analyticsController";

const analyticsRouter = Router();

/**
 * @openapi
 * '/analytics':
 *  get:
 *     tags:
 *     - Analytics management
 *     summary: Get analytics data
 *     security:
 *       - bearerAuth: []  # 👈 This enables Bearer Token authentication in Swagger
 *     responses:
 *       200:
 *         description: Successfully fetched analytics
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, token expired or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */

analyticsRouter.post(
  "/",
  authenticateUser,
  AnalyticsController.getDataAnalytics
);

export default analyticsRouter;
