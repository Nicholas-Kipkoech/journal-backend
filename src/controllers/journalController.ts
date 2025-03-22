import { Response } from "express";
import { CustomRequest } from "../shared";
import { validationResult } from "express-validator";
import { JournalService } from "../services/journalService";

// user request logic
export class JournalController {
  // add user journals
  static async addJournal(req: CustomRequest, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() });
    try {
      const journalData = req.body;
      const newJournal = await JournalService.addJournal(
        req.user.id,
        journalData
      );
      res
        .status(200)
        .json({ message: "Journal added successfully", data: newJournal });
    } catch (error) {
      console.error("error adding journal", error);
      res.status(500).json({ error: error.message });
    }
  }
  // fetch all existings journal, you can also fetch by collection id

  static async getAllJournalEntries(req: CustomRequest, res: Response) {
    try {
      const { collectionId }: string | any = req.query;
      const journalEntries = await JournalService.getAllJournalEntries(
        req.user.id,
        collectionId
      );
      res.status(200).json(journalEntries);
    } catch (error) {
      console.error("error fetching journals", error);
      res.status(500).json({ error: error.message });
    }
  }

  // get journal by id
  static async getJournalEntryById(req: CustomRequest, res: Response) {
    try {
      const { journalId } = req.params;
      const journalEntry = await JournalService.getJournalEntryById(
        req.user.id,
        journalId
      );
      res.status(200).json(journalEntry);
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteJournalEntry(req: CustomRequest, res: Response) {
    try {
      const { journalId } = req.params;
      await JournalService.deleteJournalEntry(req.user.id, journalId);
      res.status(200).json({ message: "Journal deleted successfully" });
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ error: error.message });
    }
  }
  static async updateJournalEntry(req: CustomRequest, res: Response) {
    try {
      const journalData = req.body;
      const updatedEntry = await JournalService.updateJournalEntry(
        req.user.id,
        req.params.journalId,
        journalData
      );
      res.status(200).json(updatedEntry);
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ error: error.message });
    }
  }
}
