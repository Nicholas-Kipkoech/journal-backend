import { prisma } from "../../prisma/client";
import { JournalDto } from "../shared";
import { getPixabayImage } from "../utils/pixabay";

// Database logic and crud ops
export class JournalService {
  static async addJournal(userId: string, journal: JournalDto) {
    const { title, content, collectionId, mood, moodScore, moodQuery } =
      journal;
    // find user before creating a journal
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error("No user found");
    }

    const moodImageUrl = await getPixabayImage(moodQuery);
    const newJournal = await prisma.journalEntry.create({
      data: {
        title,
        content,
        mood,
        moodScore,
        moodImageUrl: moodImageUrl,
        userId: user.id,
        collectionId: collectionId || null,
      },
    });
    return newJournal;
  }
}
