import { JournalService } from "../src/services/journalService";
import { prisma } from "../prisma/client";
import { analyzeSentiment, extractThemes } from "../src/services/aiService";
import { getMoodTrend } from "../src/utils/mood";
import { getPixabayImage } from "../src/utils/pixabay";

jest.mock("../prisma/client", () => ({
  prisma: {
    journalEntry: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    journalInsight: {
      deleteMany: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

jest.mock("../src/utils/checkUser", () => ({ checkUser: jest.fn() }));
jest.mock("../src/services/aiService", () => ({
  analyzeSentiment: jest.fn(),
  extractThemes: jest.fn(),
}));
jest.mock("../src/utils/mood", () => ({ getMoodTrend: jest.fn() }));
jest.mock("../src/utils/pixabay", () => ({ getPixabayImage: jest.fn() }));

// Typecast mocks
const mockAnalyzeSentiment = analyzeSentiment as jest.Mock;
const mockExtractThemes = extractThemes as jest.Mock;
const mockGetMoodTrend = getMoodTrend as jest.Mock;
const mockGetPixabayImage = getPixabayImage as jest.Mock;
const mockPrisma = prisma as unknown as {
  journalEntry: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    delete: jest.Mock;
    update: jest.Mock;
  };
  journalInsight: {
    deleteMany: jest.Mock;
    upsert: jest.Mock;
  };
};

describe("JournalService", () => {
  const mockUserId = "user-123";
  const mockJournalId = "journal-1";
  const mockJournal = {
    title: "Test Journal",
    content: "This is a test journal entry.",
    collectionId: "col-1",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should add a new journal entry", async () => {
    mockAnalyzeSentiment.mockResolvedValue(5);
    mockGetMoodTrend.mockReturnValue("Happy");
    mockExtractThemes.mockReturnValue(["theme1", "theme2"]);
    mockGetPixabayImage.mockResolvedValue("image_url");
    mockPrisma.journalEntry.create.mockResolvedValue({
      id: mockJournalId,
      ...mockJournal,
    });

    const result = await JournalService.addJournal(mockUserId, mockJournal);
    expect(result).toEqual({ id: mockJournalId, ...mockJournal });
    expect(mockPrisma.journalEntry.create).toHaveBeenCalled();
  });

  test("should retrieve all journal entries", async () => {
    mockPrisma.journalEntry.findMany.mockResolvedValue([
      { id: mockJournalId, ...mockJournal, mood: "Happy", moodScore: 5 },
    ]);
    const result = await JournalService.getAllJournalEntries(mockUserId);
    expect(result).toHaveLength(1);
    expect(mockPrisma.journalEntry.findMany).toHaveBeenCalled();
  });

  test("should get a journal entry by ID", async () => {
    mockPrisma.journalEntry.findUnique.mockResolvedValue({
      id: mockJournalId,
      ...mockJournal,
    });
    const result = await JournalService.getJournalEntryById(
      mockUserId,
      mockJournalId
    );
    expect(result).toEqual({ id: mockJournalId, ...mockJournal });
    expect(mockPrisma.journalEntry.findUnique).toHaveBeenCalled();
  });

  test("should delete a journal entry", async () => {
    mockPrisma.journalEntry.findFirst.mockResolvedValue({ id: mockJournalId });
    mockPrisma.journalInsight.deleteMany.mockResolvedValue({});
    mockPrisma.journalEntry.delete.mockResolvedValue({});

    await JournalService.deleteJournalEntry(mockUserId, mockJournalId);
    expect(mockPrisma.journalInsight.deleteMany).toHaveBeenCalled();
    expect(mockPrisma.journalEntry.delete).toHaveBeenCalled();
  });

  test("should update a journal entry", async () => {
    mockPrisma.journalEntry.findFirst.mockResolvedValue({
      id: mockJournalId,
      ...mockJournal,
      mood: "Happy",
      moodImageUrl: "image_url",
    });
    mockAnalyzeSentiment.mockResolvedValue(8);
    mockGetMoodTrend.mockReturnValue("Excited");
    mockExtractThemes.mockReturnValue(["theme3", "theme4"]);
    mockGetPixabayImage.mockResolvedValue("new_image_url");
    mockPrisma.journalEntry.update.mockResolvedValue({
      id: mockJournalId,
      ...mockJournal,
      mood: "Excited",
      moodImageUrl: "new_image_url",
    });

    const result = await JournalService.updateJournalEntry(
      mockUserId,
      mockJournalId,
      mockJournal
    );
    expect(result.mood).toBe("Excited");
    expect(result.moodImageUrl).toBe("new_image_url");
    expect(mockPrisma.journalEntry.update).toHaveBeenCalled();
  });
});
