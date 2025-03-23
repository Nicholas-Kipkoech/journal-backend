import { prisma } from "../../prisma/client";
import { checkUser } from "../utils/checkUser";

export class AnalyticsService {
  // get data analysis for a certain period

  static async getDataAnalytics(userId: string, period = "30d") {
    await checkUser(userId);

    // Calculate start date based on period
    const startDate = new Date();
    switch (period) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "15d":
        startDate.setDate(startDate.getDate() - 15);
        break;
      case "30d":
      default:
        startDate.setDate(startDate.getDate() - 30);
        break;
    }
    // Get entries for the period
    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        collection: true,
        journalInsight: true,
      },
    });

    // Process entries for analytics
    const moodData = entries.reduce((acc, entry) => {
      const date = entry.createdAt.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = {
          totalScore: 0,
          count: 0,
          entries: [],
        };
      }
      acc[date].totalScore += entry.moodScore;
      acc[date].count += 1;
      acc[date].entries.push(entry);
      return acc;
    }, {});
    // Calculate averages and format data for charts
    const analyticsData = Object.entries(moodData).map(([date, data]: any) => ({
      date,
      averageScore: Number((data.totalScore / data.count).toFixed(1)),
      entryCount: data.count,
    }));

    // Extract and process themes
    const themeFrequency: Record<string, number> = {};
    entries.forEach((entry) => {
      if (entry.journalInsight) {
        entry.journalInsight.themes.forEach((theme: string) => {
          themeFrequency[theme] = (themeFrequency[theme] || 0) + 1;
        });
      }
    });

    // Get the top 5 most frequent themes
    const mostFrequentThemes = Object.entries(themeFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme]) => theme);

    // Calculate overall statistics
    const overallStats = {
      totalEntries: entries.length,
      averageScore: Number(
        (
          entries.reduce((acc, entry) => acc + entry.moodScore, 0) /
          entries.length
        ).toFixed(1)
      ),
      mostFrequentMood: Object.entries(
        entries.reduce((acc, entry) => {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;
          return acc;
        }, {})
      ).sort((a: any, b: any) => b[1] - a[1])[0]?.[0],
      dailyAverage: Number(
        (
          entries.length / (period === "7d" ? 7 : period === "15d" ? 15 : 30)
        ).toFixed(1)
      ),
      mostFrequentThemes, // include themes in stats
    };
    return {
      data: { timeline: analyticsData, stats: overallStats, entries },
    };
  }
}
