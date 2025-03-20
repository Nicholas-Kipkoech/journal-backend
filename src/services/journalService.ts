import { getMoodById, MOODS } from "./../utils/mood";
import { prisma } from "../../prisma/client";
import { JournalDto } from "../shared";
import { getPixabayImage } from "../utils/pixabay";
import { checkUser } from "../utils/checkUser";

// Database logic and crud ops
export class JournalService {
  static async addJournal(userId: string, journal: JournalDto) {
    const { title, content, collectionId, mood, moodQuery } = journal;

    // find user before creating a journal
    await checkUser(userId);

    const _mood = MOODS[mood.toUpperCase()];
    if (!_mood) throw new Error("Invalid mood");

    const moodImageUrl = await getPixabayImage(moodQuery);
    const newJournal = await prisma.journalEntry.create({
      data: {
        title,
        content,
        mood: _mood.id,
        moodScore: _mood.score,
        moodImageUrl: moodImageUrl,
        userId: userId,
        collectionId: collectionId || null,
      },
    });
    return newJournal;
  }

  // fetch journals

  static async getAllJournalEntries(userId: string, collectionId?: string) {
    // check if user exists
    await checkUser(userId);
    const where = {
      userId: userId,
      // If collectionId is explicitly null, get unorganized entries
      // If it's undefined, get all entries
      ...(collectionId === "unorganized"
        ? { collectionId: null }
        : collectionId
        ? { collectionId }
        : {}),
    };

    const journalEntries = await prisma.journalEntry.findMany({
      where,
      include: {
        collection: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const entriesWithMoodData = journalEntries.map((entry) => ({
      ...entry,
      moodData: getMoodById(entry.mood),
    }));
    return entriesWithMoodData;
  }

  // fetch journal by ID

  static async getJournalEntryById(userId: string, journalId: string) {
    // check if user exists
    await checkUser(userId);

    const journalEntry = await prisma.journalEntry.findUnique({
      where: {
        id: journalId,
        userId: userId,
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!journalEntry) {
      throw new Error("journal entry not found");
    }
    return journalEntry;
  }

  // delete journal entry

  static async deleteJournalEntry(userId: string, journalId: string) {
    await checkUser(userId);

    const journalEntry = await prisma.journalEntry.findFirst({
      where: {
        id: journalId,
        userId,
      },
    });
    // check if it exists before you delete
    if (!journalEntry) {
      throw new Error("journal entry not found!!");
    }

    // otherwise delete

    await prisma.journalEntry.delete({
      where: {
        id: journalId,
      },
    });
  }
  // update journal

  static async updateJournalEntry(userId: string, journal: JournalDto) {
    await checkUser(userId);
    // Check if entry exists and belongs to user
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id: journal.id,
        userId: userId,
      },
    });

    if (!existingEntry) throw new Error("Journal entry not found");
    // Get mood data
    const mood = MOODS[journal.mood.toUpperCase()];
    if (!mood) throw new Error("Invalid mood");

    // Get new mood image if mood changed
    let moodImageUrl = existingEntry.moodImageUrl;
    if (existingEntry.mood !== mood.id) {
      moodImageUrl = await getPixabayImage(journal.moodQuery);
    }

    // Update the entry
    const updatedEntry = await prisma.journalEntry.update({
      where: { id: journal.id },
      data: {
        title: journal.title,
        content: journal.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl,
        collectionId: journal.collectionId || null,
      },
    });
    return updatedEntry;
  }
}
