import { getMoodTrend } from "../utils/mood";
import { prisma } from "../../prisma/client";
import { JournalDto } from "../shared";
import { getPixabayImage } from "../utils/pixabay";
import { checkUser } from "../utils/checkUser";
import { analyzeSentiment, extractThemes } from "./aiService";

export class JournalService {
  // Add a new journal entry
  static async addJournal(userId: string, journal: JournalDto) {
    const { title, content, collectionId } = journal;

    // Ensure user exists
    await checkUser(userId);

    // Analyze sentiment for mood score
    const moodScore = await analyzeSentiment(content);
    const mood = getMoodTrend(moodScore);

    // Extract themes for insights
    const themes = extractThemes(content);

    // Get mood-related image
    const moodImageUrl = await getPixabayImage(mood);

    // Create journal entry
    const newJournal = await prisma.journalEntry.create({
      data: {
        title,
        content,
        mood,
        moodScore,
        moodImageUrl,
        userId,
        collectionId: collectionId || null,
        journalInsight: {
          create: {
            sentiment: moodScore,
            wordCount: content.split(/\s+/).length,
            themes,
          },
        },
      },
    });

    return newJournal;
  }

  // Get all journal entries for a user
  static async getAllJournalEntries(userId: string, collectionId?: string) {
    await checkUser(userId);

    const where = {
      userId,
      collectionId:
        collectionId === "unorganized" ? null : collectionId || undefined,
    };

    const journalEntries = await prisma.journalEntry.findMany({
      where,
      include: {
        collection: { select: { id: true, name: true } },
      },
    });

    return journalEntries.map((entry) => ({
      ...entry,
      moodData: { mood: entry.mood, score: entry.moodScore }, // Ensuring mood data consistency
    }));
  }

  // Get a specific journal entry by ID
  static async getJournalEntryById(userId: string, journalId: string) {
    await checkUser(userId);

    const journalEntry = await prisma.journalEntry.findUnique({
      where: { id: journalId, userId },
      include: {
        collection: { select: { id: true, name: true } },
      },
    });

    if (!journalEntry) throw new Error("Journal entry not found");

    return journalEntry;
  }

  // Delete a journal entry
  static async deleteJournalEntry(userId: string, journalId: string) {
    await checkUser(userId);

    const journalEntry = await prisma.journalEntry.findFirst({
      where: { id: journalId, userId },
    });

    if (!journalEntry) throw new Error("Journal entry not found");

    await prisma.journalEntry.delete({ where: { id: journalId } });
  }

  // Update an existing journal entry
  static async updateJournalEntry(
    userId: string,
    journalId: string,
    journal: JournalDto
  ) {
    await checkUser(userId);

    // Check if the journal entry exists
    const existingEntry = await prisma.journalEntry.findFirst({
      where: { id: journalId, userId },
    });

    if (!existingEntry) throw new Error("Journal entry not found");

    // Recalculate mood and sentiment analysis
    const moodScore = await analyzeSentiment(journal.content);
    const mood = getMoodTrend(moodScore);
    const themes = extractThemes(journal.content);

    // Get new mood image only if mood changed
    let moodImageUrl = existingEntry.moodImageUrl;
    if (existingEntry.mood !== mood) {
      moodImageUrl = await getPixabayImage(mood);
    }

    // Update journal entry
    const updatedEntry = await prisma.journalEntry.update({
      where: { id: journalId },
      data: {
        title: journal.title,
        content: journal.content,
        mood,
        moodScore,
        moodImageUrl,
        collectionId: journal.collectionId || null,
        journalInsight: {
          upsert: {
            create: {
              sentiment: moodScore,
              wordCount: journal.content.split(/\s+/).length,
              themes,
            },
            update: {
              sentiment: moodScore,
              wordCount: journal.content.split(/\s+/).length,
              themes,
            },
          },
        },
      },
    });

    return updatedEntry;
  }
}
