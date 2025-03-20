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
}
