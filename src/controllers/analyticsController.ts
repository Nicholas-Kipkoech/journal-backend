import { Response } from "express";
import { CustomRequest } from "../shared";
import { AnalyticsService } from "./../services/analyticsService";
export class AnalyticsController {
  static async getDataAnalytics(req: CustomRequest, res: Response) {
    try {
      const { period } = req.body;
      const analytics = await AnalyticsService.getDataAnalytics(
        req.user.id,
        period
      );
      res.status(200).json({ data: analytics.data });
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ error: error.message });
    }
  }
}
