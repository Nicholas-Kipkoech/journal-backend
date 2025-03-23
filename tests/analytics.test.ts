import { prisma } from "../prisma/client";
import { checkUser } from "../src/utils/checkUser";
import { AnalyticsService } from "../src/services/analyticsService";

jest.mock("../prisma/client", () => ({
  prisma: {
    journalEntry: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("../src/utils/checkUser", () => ({
  checkUser: jest.fn(),
}));

describe("AnalyticsService", () => {
  const mockUserId = "user-123";
  const mockEntries = [
    {
      id: "entry-1",
      userId: mockUserId,
      mood: "Happy",
      moodScore: 4,
      createdAt: new Date("2024-03-01T12:00:00Z"),
      collection: { id: "col-1", name: "Work" },
    },
    {
      id: "entry-2",
      userId: mockUserId,
      mood: "Sad",
      moodScore: 2,
      createdAt: new Date("2024-03-02T12:00:00Z"),
      collection: { id: "col-2", name: "Personal" },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return analytics data for a user over 30 days", async () => {
    (checkUser as jest.Mock).mockResolvedValue(undefined);
    (prisma.journalEntry.findMany as jest.Mock).mockResolvedValue(mockEntries);

    const result = await AnalyticsService.getDataAnalytics(mockUserId, "30d");

    expect(result.data.stats.totalEntries).toBe(2);
    expect(result.data.stats.averageScore).toBe(3.0);
    expect(result.data.stats.mostFrequentMood).toBe("Happy");
    expect(prisma.journalEntry.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: mockUserId }),
      })
    );
  });

  test("should call checkUser before fetching data", async () => {
    (checkUser as jest.Mock).mockResolvedValue(undefined);
    (prisma.journalEntry.findMany as jest.Mock).mockResolvedValue([]);

    await AnalyticsService.getDataAnalytics(mockUserId, "7d");

    expect(checkUser).toHaveBeenCalledWith(mockUserId);
  });
});
